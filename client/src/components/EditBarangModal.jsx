import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { singleBarangFn, updateBarangFn } from "../api/barang";
import Swal from "sweetalert2";

export default function EditBarangModal({refetch, barangId}) {
    const {
        register,
        handleSubmit: submitEditBarang,
        formState: { errors },
        reset: resetEditBarang,
        setValue,
      } = useForm({
        defaultValues: {
          nama_barang: "",
          jenis_barang: "",
          stok: "",
        },
      });
    
      const {
        data: dataSingleBarang,
        refetch: refetchSingleBarang,
        isLoading: loadingSingleBarang,
      } = useQuery(
        ["Single Barang", barangId],
        () => singleBarangFn(barangId),
        {
          enabled:
            barangId !== undefined || barangId !== null || barangId !== "",
        }
      );
    
      useEffect(() => {
        if (barangId !== null || barangId !== undefined) {
          refetchSingleBarang();
        }
      }, [barangId, refetchSingleBarang]);
    
      useEffect(() => {
        if (!loadingSingleBarang && dataSingleBarang) {
          resetEditBarang({
            nama_barang: dataSingleBarang.nama_barang,
            jenis_barang: dataSingleBarang.jenis_barang,
            stok: dataSingleBarang.stok,
          });
        }
      }, [loadingSingleBarang, dataSingleBarang, resetEditBarang]);
    
      const handleUpdateBarang = useMutation({
        mutationFn: (data) => updateBarangFn(barangId, data),
        onMutate() {},
        onSuccess: async (res) => {
          console.log(res);
          await refetchSingleBarang();
          await refetch();
          resetEditBarang();
          document.getElementById("edit_barang").close();
          await Swal.fire({
            icon: "success",
            title: "Barang Edited!",
            text: "Barang has been successfully edited.",
          });
        },
        onError: async (error) => {
          console.log(error);
    
          let errorMessage;
    
          if (error.response && error.response.msg) {
            errorMessage = error.response.msg;
          } else {
            errorMessage = error.response;
          }
    
          document.getElementById("edit_barang").close();
          await Swal.fire({
            icon: "error",
            title: "Error editing Barang!",
            text: errorMessage,
          }).then((result) => {
            if (result.isConfirmed) {
              document.getElementById("edit_barang").showModal();
            }
          });
        },
      });
    
      const updateBarang = (data) => {
        console.log("data", data);
        handleUpdateBarang.mutateAsync(data);
      };
    
  return (
    <dialog id="edit_barang" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Edit Barang</h3>
        <FormProvider {...useForm}>
          <form onSubmit={submitEditBarang(updateBarang)}>
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
                {...register("nama_barang")}
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
                {...register("jenis_barang")}
              />
            </div>

            <div>
              <label
                htmlFor="stok"
                className="flex font-semibold text-l mt-3"
              >
                Stok
              </label>
              <input
                className="input input-bordered w-full rounded-lg mt-2 justify-start"
                placeholder="Stok"
                {...register("stok")}
              />
            </div>

            <div className="w-full flex justify-end">
              <button
                className="btn btn-ghost btn-xl bg-[#06476F] text-white rounded-sm mt-2"
                type="submit"
              >
                Edit
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </dialog>
  );
}
