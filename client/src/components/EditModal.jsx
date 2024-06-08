import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { singleTransaksiFn, updateTransaksiFn } from "../api/transaksi";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function EditModal({ refetch, transaksiId }) {
  const {
    register,
    handleSubmit: submitEditTransaksi,
    formState: { errors },
    reset: resetEditTransaksi,
    setValue,
  } = useForm({
    defaultValues: {
      id_barang: "",
      jumlah_terjual: "",
      tanggal: "",
    },
  });

  const {
    data: dataSingleTransaksi,
    refetch: refetchSingleTransaksi,
    isLoading: loadingSingleTransaksi,
  } = useQuery(
    ["Single Transaksi", transaksiId],
    () => singleTransaksiFn(transaksiId),
    {
      enabled:
        transaksiId !== undefined || transaksiId !== null || transaksiId !== "",
    }
  );

  useEffect(() => {
    if (transaksiId !== null || transaksiId !== undefined) {
      refetchSingleTransaksi();
    }
  }, [transaksiId, refetchSingleTransaksi]);

  useEffect(() => {
    if (!loadingSingleTransaksi && dataSingleTransaksi) {
      resetEditTransaksi({
        id_barang: dataSingleTransaksi.barang.id_barang,
        jumlah_terjual: dataSingleTransaksi.jumlah_terjual,
        tanggal: dataSingleTransaksi.tanggal,
      });
    }
  }, [loadingSingleTransaksi, dataSingleTransaksi, resetEditTransaksi]);

  const handleUpdateTransaksi = useMutation({
    mutationFn: (data) => updateTransaksiFn(transaksiId, data),
    onMutate() {},
    onSuccess: async (res) => {
      console.log(res);
      await refetchSingleTransaksi();
      await refetch();
      resetEditTransaksi();
      document.getElementById("edit_transaksi").close();
      await Swal.fire({
        icon: "success",
        title: "Transaksi Edited!",
        text: "Transaksi has been successfully edited.",
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

      document.getElementById("edit_transaksi").close();
      await Swal.fire({
        icon: "error",
        title: "Error editing Transaksi!",
        text: errorMessage,
      }).then((result) => {
        if (result.isConfirmed) {
          document.getElementById("edit_transaksi").showModal();
        }
      });
    },
  });

  const updateTransaksi = (data) => {
    console.log("data", data);
    handleUpdateTransaksi.mutateAsync(data);
  };

  return (
    <dialog id="edit_transaksi" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">Edit Transaksi!</h3>
        <FormProvider {...useForm}>
          <form onSubmit={submitEditTransaksi(updateTransaksi)}>
            <div>
              <label
                htmlFor="id_barang"
                className="flex font-semibold text-l mt-3"
              >
                ID Barang
              </label>
              <input
                className="input input-bordered w-full rounded-lg mt-2 justify-start"
                placeholder="Id Barang"
                {...register("id_barang")}
              />
            </div>
            <div>
              <label
                htmlFor="jumlah_terjual"
                className="flex font-semibold text-l mt-3"
              >
                Jumlah Terjual
              </label>
              <input
                className="input input-bordered w-full rounded-lg mt-2 justify-start"
                placeholder="Jumlah Terjual"
                {...register("jumlah_terjual")}
              />
            </div>

            <div>
              <label
                htmlFor="tanggal"
                className="flex font-semibold text-l mt-3"
              >
                Tanggal
              </label>
              <input
                className="input input-bordered w-full rounded-lg mt-2 justify-start"
                placeholder="Tanggal"
                {...register("tanggal")}
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
