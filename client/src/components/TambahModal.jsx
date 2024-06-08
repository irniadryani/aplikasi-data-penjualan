import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { submitTransaksiFn } from "../api/transaksi";
import Swal from "sweetalert2";

export default function TambahModal({ refetch }) {
  const {
    register,
    handleSubmit: submitTambahTransaksi,
    formState: { errors },
    reset: resetTambahTransaksi,
  } = useForm();

  const handleTransaksiResponse = useMutation({
    mutationFn: (data) => submitTransaksiFn(data),

    onMutate() {},
    onSuccess: (res) => {
      console.log(res);
      refetch();
      resetTambahTransaksi();
      Swal.fire({
        icon: "success",
        title: "Transaksi Created!",
        text: "Transaksi has been successfully created.",
      });
      document.getElementById("tambah_transaksi").close();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const addTransaksi = (data) => {
    const transaksi = new FormData(); 

    transaksi.append("id_barang", data.id_barang);
    transaksi.append("jumlah_terjual", data.jumlah_terjual);
    transaksi.append("tanggal", data.tanggal);

    handleTransaksiResponse.mutateAsync(transaksi);
  };

  return (
    <dialog id="tambah_transaksi" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={submitTambahTransaksi(addTransaksi)}>
          <h3 className="font-bold text-lg">Input Transaksi</h3>
          <div>
            <label
              htmlFor="id_barang"
              className="flex font-semibold text-l mt-3"
            >
              ID Barang
            </label>
            <input
              className="input input-bordered w-full rounded-lg mt-2 justify-start"
              placeholder="ID Barang"
              {...register("id_barang", { required: true })}
            />
          </div>

          <div>
            <label
              htmlFor="materi_batch"
              className="flex font-semibold text-l mt-3"
            >
              Jumlah Terjual
            </label>
            <input
              className="input input-bordered w-full rounded-lg mt-2 justify-start"
              placeholder="Jumlah Terjual"
              {...register("jumlah_terjual", { required: true })}
            />
          </div>

          <div>
            <label htmlFor="tanggal" className="flex font-semibold text-l mt-3">
              Tanggal
            </label>
            <input
              className="input input-bordered w-full rounded-lg mt-2 justify-start"
              placeholder="Tanggal"
              {...register("tanggal", { required: true })}
            />
          </div>
          <div className="w-full flex justify-end">
            <button
              className="btn btn-ghost btn-xl bg-[#06476F] text-white rounded-lg mt-2"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
