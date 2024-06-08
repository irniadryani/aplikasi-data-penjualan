import React, { useState } from "react";
import { VscEdit, VscTrash } from "react-icons/vsc";
import Swal from "sweetalert2";
import { deleteBarangFn } from "../api/barang";
import { useMutation } from "react-query";
import EditBarangModal from "./EditBarangModal";

export default function TableBarang({ dataBarang, refetch }) {
  const [barangId, setBarangId] = useState(0);
  
  const handleDeleteBarang = useMutation({
    mutationFn: (data) => deleteBarangFn(data),
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
        await handleDeleteBarang.mutateAsync(id);
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
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr className="text-center text-sm text-black">
              <th>No</th>
              <th>ID Barang</th>
              <th>Nama Barang</th>
              <th>Jenis Barang</th>
              <th>Stok</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataBarang?.map((barang, index) => (
              <tr className="text-sm text-black text-center" key={index}>
                <td>{index + 1}</td>
                <td>{barang.id_barang}</td>
                <td>{barang.nama_barang}</td>
                <td>{barang.jenis_barang}</td>
                <td>{barang.stok}</td>
                <td>
                  <div className="flex flex-row gap-5 justify-center">
                    <button
                      className="bg-[#06476F] text-white rounded-full p-2 w-8"
                      onClick={() => {
                        setBarangId(barang.id_barang);
                        document.getElementById("edit_barang").showModal();
                      }}
                    >
                      <div className="flex items-center">
                        <VscEdit fontSize="1.125rem" />
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleConfirmDelete(barang.id_barang);
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
      <EditBarangModal data={dataBarang} refetch={refetch} barangId={barangId}/>
    </div>
  );
}
