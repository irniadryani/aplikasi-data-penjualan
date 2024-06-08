import React from "react";
import TableBarang from "../components/TableBarang";
import { allBarangFn } from "../api/barang";
import { useQuery } from "react-query";
import TambahBarangModal from "../components/TambahBarangModal";

export default function Barang() {
    const {
        data: dataBarang,
        refetch: refetchBarang,
        isLoading: loadingBarang,
      } = useQuery("barang", allBarangFn);
    
  return (
    <div>
      <h1 className="text-xl font-bold text-center text-black m-10"> Data Barang</h1>
      <button
            className="btn bg-cyan-900 flex text-white shadow-2xl my-5 justify-end"
            onClick={() =>
              document.getElementById("tambah_barang").showModal()
            }
          >
            Tambah Barang
          </button>
      <TableBarang dataBarang={dataBarang} refetch={refetchBarang}/>
      <TambahBarangModal dataBarang={dataBarang} refetch={refetchBarang}/>
    </div>
  );
}
