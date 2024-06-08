CREATE DATABASE data_penjualan;

CREATE TABLE barang (
  id_barang SERIAL PRIMARY KEY,
  nama_barang VARCHAR(255) NOT NULL,
  jenis_barang VARCHAR(255) NOT NULL
);

CREATE TABLE transaksi (
  id_transaksi SERIAL PRIMARY KEY,
  id_barang INT,
  stok INT,
  jumlah_terjual INT,
  tanggal_transaksi DATE,
  FOREIGN KEY (id_barang) REFERENCES barang(id_barang)
);

