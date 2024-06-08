import React, { useState, useEffect } from "react";
import { VscEdit, VscTrash } from "react-icons/vsc";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { deleteTransaksiFn } from "../api/transaksi";
import Swal from "sweetalert2";
import EditModal from "./EditModal";

export default function Table({ dataTransaksi, refetch, search, sorting }) {
  const [transaksiId, setTransaksiId] = useState(0);
  const [filteredTransaksi, setFilteredTransaksi] = useState([]);

  useEffect(() => {
    if (dataTransaksi && dataTransaksi.length > 0) {
      // Filter berdasarkan pencarian
      const filtered = dataTransaksi.filter((transaksi) =>
        transaksi.barang.nama_barang
          .toLowerCase()
          .includes(search.toLowerCase())
      );

      // Sorting hasil filter jika ada opsi sorting yang dipilih
      let sorted = [...filtered];
      if (sorting) {
        switch (sorting) {
          case "Nama Barang A-Z":
            sorted.sort((a, b) =>
              a.barang.nama_barang.localeCompare(b.barang.nama_barang)
            );
            break;
          case "Nama Barang Z-A":
            sorted.sort((a, b) =>
              b.barang.nama_barang.localeCompare(a.barang.nama_barang)
            );
            break;
          case "Transaksi Terbaru":
            sorted.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
            break;
          case "Transaksi Terlama":
            sorted.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
            break;
          default:
            break;
        }
      }
      setFilteredTransaksi(sorted);
    }
  }, [dataTransaksi, search, sorting]);

  const handleDeleteTransaksi = useMutation({
    mutationFn: (data) => deleteTransaksiFn(data),
    onMutate() {},
    onSuccess: (res) => {
      console.log(res);
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleConfirmDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await handleDeleteTransaksi.mutateAsync(id);
        Swal.fire({
          title: "Deleted!",
          text: "Transaksi has been deleted.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaksi", {
        position: "top-right",
      });
    }
  };

  return (
    <div className=" my-10">
      <div className="overflow-x-auto  bg-white rounded-lg">
        <table className="table table-zebra">
          <thead>
            <tr className="text-sm text-black text-center">
              <th>No</th>
              <th>Nama Barang</th>
              <th>Stok</th>
              <th>Jumlah Terjual</th>
              <th>Tanggal Transaksi</th>
              <th>Jenis Barang</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransaksi.map((transaksi, index) => (
              <tr className="text-sm text-black text-center" key={index}>
                <td>{index + 1}</td>
                <td>{transaksi.barang.nama_barang}</td>
                <td>{transaksi.barang.stok}</td>
                <td>{transaksi.jumlah_terjual}</td>
                <td>{transaksi.tanggal}</td>
                <td>{transaksi.barang.jenis_barang}</td>
                <td>
                  <div className="flex flex-row gap-5 justify-center">
                    <button
                      className="bg-[#06476F] text-white rounded-full p-2 w-8"
                      onClick={() => {
                        setTransaksiId(transaksi.id_transaksi);
                        document.getElementById("edit_transaksi").showModal();
                      }}
                    >
                      <div className="flex items-center">
                        <VscEdit fontSize="1.125rem" />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleConfirmDelete(transaksi.id_transaksi);
                      }}
                      className="bg-[#06476F] text-white rounded-full p-2  "
                    >
                      <VscTrash fontSize="1.125rem" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditModal refetch={refetch} transaksiId={transaksiId} />
    </div>
  );
}
