const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

app.post("/transaksi", async (req, res) => {
  try {
    const { id_barang, jumlah_terjual, tanggal } = req.body;

    const barang = await pool.query(
      "SELECT id_barang, nama_barang, stok, jenis_barang FROM barang WHERE id_barang = $1 FOR UPDATE",
      [id_barang]
    );

    if (barang.rows.length === 0) {
      return res.status(404).json({ error: "Barang tidak ditemukan" });
    }

    const stok_barang = barang.rows[0].stok;

    if (jumlah_terjual > stok_barang) {
      return res.status(400).json({ error: "Stok barang tidak mencukupi" });
    }

    const newTransaksi = await pool.query(
      "INSERT INTO transaksi (id_barang, jumlah_terjual, tanggal) VALUES ($1, $2, $3) RETURNING *",
      [id_barang, jumlah_terjual, tanggal]
    );

    await pool.query(
      "UPDATE barang SET stok = stok - $1 WHERE id_barang = $2",
      [jumlah_terjual, id_barang]
    );

    const id_transaksi = newTransaksi.rows[0].id_transaksi;

    const response = {
      id_transaksi: id_transaksi,
      barang: {
        id_barang: barang.rows[0].id_barang,
        nama_barang: barang.rows[0].nama_barang,
        jenis_barang: barang.rows[0].jenis_barang,
        stok: stok_barang,
      },
      jumlah_terjual: jumlah_terjual,
      tanggal: tanggal,
    };

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

app.get("/transaksi", async (req, res) => {
  try {
    const barang = await pool.query(
      "SELECT id_barang, nama_barang, jenis_barang, stok FROM barang"
    );
    const transaksi = await pool.query(
      "SELECT id_transaksi, id_barang, jumlah_terjual, tanggal FROM transaksi"
    );

    const responses = [];

    transaksi.rows.forEach((row) => {
      const barangTransaksi = barang.rows.find(
        (barang) => barang.id_barang === row.id_barang
      );

      const response = {
        id_transaksi: row.id_transaksi,
        barang: {
          id_barang: barangTransaksi.id_barang,
          nama_barang: barangTransaksi.nama_barang,
          jenis_barang: barangTransaksi.jenis_barang,
          stok: barangTransaksi.stok,
        },
        jumlah_terjual: row.jumlah_terjual,
        tanggal: row.tanggal,
      };

      responses.push(response);
    });

    res.json(responses);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server Error");
  }
});

app.get("/transaksi/:id_transaksi", async (req, res) => {
  try {
    const { id_transaksi } = req.params;

    const transaksiQuery = await pool.query(
      "SELECT id_transaksi, id_barang, jumlah_terjual, tanggal FROM transaksi WHERE id_transaksi = $1",
      [id_transaksi]
    );

    if (transaksiQuery.rows.length === 0) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    }

    const transaksi = transaksiQuery.rows[0];

    const barangQuery = await pool.query(
      "SELECT id_barang, nama_barang, jenis_barang, stok FROM barang WHERE id_barang = $1",
      [transaksi.id_barang]
    );

    const barang = barangQuery.rows[0];

    const response = {
      id_transaksi: transaksi.id_transaksi,
      barang: {
        id_barang: barang.id_barang,
        nama_barang: barang.nama_barang,
        jenis_barang: barang.jenis_barang,
        stok: barang.stok,
      },
      jumlah_terjual: transaksi.jumlah_terjual,
      tanggal: transaksi.tanggal,
    };

    res.json(response);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server Error");
  }
});

app.put("/transaksi/:id_transaksi", async (req, res) => {
  try {
    const { id_transaksi } = req.params;
    const { id_barang, jumlah_terjual, tanggal } = req.body;

    const transaksiSebelum = await pool.query(
      "SELECT id_barang, jumlah_terjual,tanggal FROM transaksi WHERE id_transaksi = $1",
      [id_transaksi]
    );

    if (transaksiSebelum.rows.length === 0) {
      return res.status(404).json({ error: "Data transaksi tidak ditemukan" });
    }

    console.log("transaksi", transaksiSebelum);

    const id_barang_sebelum = transaksiSebelum.rows[0].id_barang;
    const jumlah_terjual_sebelum = transaksiSebelum.rows[0].jumlah_terjual;

    await pool.query(
      "UPDATE barang SET stok = stok + $1 WHERE id_barang = $2",
      [jumlah_terjual_sebelum, id_barang_sebelum]
    );

    const barang = await pool.query(
      "SELECT stok FROM barang WHERE id_barang = $1",
      [id_barang]
    );

    if (barang.rows.length === 0) {
      return res.status(404).json({ error: "Barang tidak ditemukan" });
    }

    const stok_barang_awal = barang.rows[0].stok;

    if (jumlah_terjual > stok_barang_awal) {
      return res.status(400).json({ error: "Stok barang tidak mencukupi" });
    }

    const updateTransaksi = await pool.query(
      "UPDATE transaksi SET id_barang=$1, jumlah_terjual=$2, tanggal=$3 WHERE id_transaksi=$4",
      [id_barang, jumlah_terjual, tanggal, id_transaksi]
    );

    await pool.query(
      "UPDATE barang SET stok = stok - $1 WHERE id_barang = $2",
      [jumlah_terjual, id_barang]
    );

    res.json("Transaksi telah diperbarui");
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server Error");
  }
});

app.delete("/transaksi/:id_transaksi", async (req, res) => {
  try {
    const { id_transaksi } = req.params;

    const transaksi = await pool.query(
      "SELECT id_barang, jumlah_terjual FROM transaksi WHERE id_transaksi = $1",
      [id_transaksi]
    );

    if (transaksi.rows.length === 0) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan" });
    }

    const { id_barang, jumlah_terjual } = transaksi.rows[0];

    const updateStok = await pool.query(
      "UPDATE barang SET stok = stok + $1 WHERE id_barang = $2",
      [jumlah_terjual, id_barang]
    );

    const deleteTransaksi = await pool.query(
      "DELETE FROM transaksi WHERE id_transaksi = $1",
      [id_transaksi]
    );

    res.json("Transaksi telah dihapus dan stok telah diperbarui");
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server Error");
  }
});

// app.get("/search", async (req, res) => {
//   try {
//     const { nama_barang } = req.query;

//     const result = await pool.query(
//       "SELECT * FROM barang WHERE nama_barang ILIKE $1",
//       [`%${nama_barang}%`]
//     );

//     res.json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json("Server Error");
//   }
// });

app.get("/search", async (req, res) => {
  try {
    const { nama_barang } = req.query;

    const result = await pool.query(
      "SELECT t.id_transaksi, t.id_barang, t.jumlah_terjual, t.tanggal, b.nama_barang, b.jenis_barang, b.stok FROM transaksi t JOIN barang b ON t.id_barang = b.id_barang WHERE b.nama_barang ILIKE $1",
      [`%${nama_barang}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

app.get("/sort", async (req, res) => {
  try {
    const {
      nama_barang,
      jenis_barang,
      orderBy = "nama_barang",
      orderDirection = "asc",
    } = req.query;

    const validOrderFields = ["nama_barang", "tanggal"];
    const validOrderDirections = ["asc", "desc"];

    if (!validOrderFields.includes(orderBy)) {
      return res.status(400).json({ error: "Invalid orderBy field" });
    }
    if (!validOrderDirections.includes(orderDirection)) {
      return res.status(400).json({ error: "Invalid orderDirection value" });
    }

    const result = await pool.query(
      `SELECT t.id_transaksi, t.id_barang, t.jumlah_terjual, t.tanggal, b.nama_barang, b.jenis_barang, b.stok 
            FROM transaksi t
            JOIN barang b ON t.id_barang = b.id_barang 
            WHERE ($1::text IS NULL OR b.nama_barang ILIKE $1) 
              AND ($2::text IS NULL OR b.jenis_barang ILIKE $2) 
            ORDER BY ${orderBy} ${orderDirection}`,
      [
        nama_barang ? `%${nama_barang}%` : null,
        jenis_barang ? `%${jenis_barang}%` : null,
      ]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server Error");
  }
});

app.get("/chart", async (req, res) => {
  try {
    const { bulan, tahun } = req.query;

    if (!bulan || !tahun) {
      return res
        .status(400)
        .json({ error: "Bulan dan tahun harus disertakan" });
    }

    const result = await pool.query(
      `SELECT b.jenis_barang, SUM(t.jumlah_terjual) as total_terjual
             FROM transaksi t
             JOIN barang b ON t.id_barang = b.id_barang
             WHERE EXTRACT(MONTH FROM t.tanggal) = $1 AND EXTRACT(YEAR FROM t.tanggal) = $2
             GROUP BY b.jenis_barang
             ORDER BY b.jenis_barang`,
      [bulan, tahun]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server Error");
  }
});

app.get("/barang", async (req, res) => {
  try {
    const allBarang = await pool.query("SELECT * FROM barang");
    res.json(allBarang.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/barang/:id_barang", async (req, res) => {
  try {
    const { id_barang } = req.params;
    const getBarangById = await pool.query(
      "SELECT * FROM barang WHERE id_barang=$1",
      [id_barang]
    );
   
    res.json(getBarangById.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/barang", async (req, res) => {
  try {
    const { nama_barang, jenis_barang, stok } = req.body;
    const newBarang = await pool.query(
      "INSERT INTO barang (nama_barang,jenis_barang,stok) VALUES($1,$2,$3) RETURNING *",
      [nama_barang, jenis_barang, stok]
    );
    res.json(newBarang.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/barang/:id_barang", async (req, res) => {
  const { id_barang } = req.params;
  const { nama_barang, jenis_barang, stok } = req.body;
  const updateBarang = await pool.query(
    "UPDATE barang SET nama_barang=$1, jenis_barang=$2, stok=$3 WHERE id_barang=$4",
    [nama_barang, jenis_barang, stok, id_barang]
  );
  res.json("Barang Telah Diperbarui");
});

app.delete("/barang/:id_barang", async (req, res) => {
  try {
    const { id_barang } = req.params;
    const deleteBarang = await pool.query(
      "DELETE FROM barang WHERE id_barang=$1",
      [id_barang]
    );
    res.json("Barang Telah Dihapus");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
