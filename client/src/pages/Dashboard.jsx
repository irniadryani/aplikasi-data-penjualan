import React, { useState } from "react";
import Table from "../components/Table";
import {
  allTransaksiFn,
  searchByNameFn,
  sortingDataFn,
} from "../api/transaksi";
import { useQuery, useMutation } from "react-query";
import TambahModal from "../components/TambahModal";
import Chart from "../components/Chart";
import Icon from "../assets/icon_2.png";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const {
    data: dataTransaksi,
    refetch: refetchTransaksi,
    isLoading: loadingTransaksi,
  } = useQuery("transaksi", allTransaksiFn);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [sortingOption, setSortingOption] = useState(null);
  const [sortingResults, setSortingResults] = useState(null);

  const handleSearch = useMutation({
    mutationFn: (nama_barang) => searchByNameFn(nama_barang),
    onMutate() {},
    onSuccess: (res) => {
      setSearchResults(res);
      console.log(res);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch.mutate(search);
  };

  const handleSortingChange = async (selectedOption) => {
    setSortingOption(selectedOption);
    let orderBy, orderDirection;
    switch (selectedOption) {
      case "Nama Barang A-Z":
        orderBy = "transaksi.barang.nama_barang";
        orderDirection = "asc";
        break;
      case "Nama Barang Z-A":
        orderBy = "transaksi.barang.nama_barang";
        orderDirection = "desc";
        break;
      case "Transaksi Terbaru":
        orderBy = "transaksi.tanggal";
        orderDirection = "desc";
        break;
      case "Transaksi Terlama":
        orderBy = "transaksi.tanggal";
        orderDirection = "asc";
        break;
      default:
        return;
    }
    try {
      const data = await sortingDataFn(orderBy, orderDirection);
      setSortingResults(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between bg-cyan-800 rounded-lg my-10">
        <div className="flex justify-start">
          <h1 className="text-6xl font-bold text-left text-white m-10">
            Data Penjualan
          </h1>
        </div>

        <div className="flex w-full justify-end items-end">
          <img className="w-96" src={Icon}></img>
        </div>
      </div>

      <Chart dataTransaksi={dataTransaksi} refetch={refetchTransaksi} />

      <div className="flex justify-between">
        <div className="flex flex-row gap-5">
          <button
            className="btn bg-cyan-900 flex text-white shadow-2xl my-5 justify-end"
            onClick={() =>
              document.getElementById("tambah_transaksi").showModal()
            }
          >
            Tambah Transaksi
          </button>
          <Link to="/barang">
            <button className="btn bg-cyan-900 flex text-white shadow-2xl my-5 justify-end">
              Input Data Barang
            </button>
          </Link>
        </div>

        <div className="flex items-center">
          <form
            className="flex flex-col md:flex-row gap-3"
            onSubmit={onSearchSubmit}
          >
            <div className="flex">
              <input
                type="text"
                placeholder="Cari nama barang"
                className="w-full md:w-80 px-3 h-10 rounded-l border-2 border-cyan-900 focus:outline-none focus:border-cyan-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
          <select
            id="sortingOption"
            name="sortingOption"
            className="w-full h-10 border-2 border-cyan-900 focus:outline-none focus:border-cyan-900 text-cyan-900 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
            value={sortingOption}
            onChange={(e) => handleSortingChange(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Nama Barang A-Z">Nama Barang A-Z</option>
            <option value="Nama Barang Z-A">Nama Barang Z-A</option>
            <option value="Transaksi Terbaru">Transaksi Terbaru</option>
            <option value="Transaksi Terlama">Transaksi Terlama</option>
          </select>
        </div>
      </div>

      <Table
        dataTransaksi={searchResults || sortingResults || dataTransaksi}
        refetch={refetchTransaksi}
        search={search}
        sorting={sortingOption}
      />

      <TambahModal refetch={refetchTransaksi} />
    </div>
  );
}
