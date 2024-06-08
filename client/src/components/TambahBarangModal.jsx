import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import Swal from "sweetalert2";
import { submitBarangFn } from "../api/barang";

export default function TambahBarangModal({refetch}) {
    const {
        register,
        handleSubmit: submitTambahBarang,
        formState: { errors },
        reset: resetTambahBarang,
      } = useForm();
    
      const handleBarangResponse = useMutation({
        mutationFn: (data) => submitBarangFn(data),
    
        onMutate() {},
        onSuccess: (res) => {
          console.log(res);
          refetch();
          resetTambahBarang();
          Swal.fire({
            icon: "success",
            title: "Barang Created!",
            text: "Barang has been successfully created.",
          });
          document.getElementById("tambah_barang").close();
        },
        onError: (error) => {
          console.log(error);
        },
      });
    
      const addBarang = (data) => {
      
    
        handleBarangResponse.mutateAsync(data);
        console.log(data);
      };
    
  return (
    <dialog id="tambah_barang" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={submitTambahBarang(addBarang)}>
          <h3 className="font-bold text-lg">Input Barang</h3>
          <div>
            <label
              htmlFor="nama_barang"
              className="flex font-semibold text-l mt-3"
            >
              Nama Barang
            </label>
            <input
              className="input input-bordered w-full rounded-lg mt-2 justify-start"
              placeholder="Nama Barang"
              {...register("nama_barang", { required: true })}
            />
          </div>

          <div>
            <label
              htmlFor="jenis_barang"
              className="flex font-semibold text-l mt-3"
            >
              Jenis Barang
            </label>
            <input
              className="input input-bordered w-full rounded-lg mt-2 justify-start"
              placeholder="Jenis Barang"
              {...register("jenis_barang", { required: true })}
            />
          </div>

          <div>
            <label htmlFor="stok" className="flex font-semibold text-l mt-3">
              Stok
            </label>
            <input
              className="input input-bordered w-full rounded-lg mt-2 justify-start"
              placeholder="Stok"
              {...register("stok", { required: true })}
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
