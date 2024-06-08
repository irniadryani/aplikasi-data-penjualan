import { Api } from "../lib/common";
const formDataconfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const allTransaksiFn = async () => {
  const response = await Api.get("transaksi");
  return response.data;
};

export const singleTransaksiFn = async (id) => {
  const response = await Api.get(`transaksi/${id}`);
  return response.data;
};

export const submitTransaksiFn = async (data) => {
  const response = await Api.post("transaksi", data);
  return response.data;
};

export const updateTransaksiFn = async (id, data) => {
  const response = await Api.put(`transaksi/${id}`, data);
  return response.data;
};

export const deleteTransaksiFn = async (id) => {
  const response = await Api.delete(`transaksi/${id}`);
  return response.data;
};

export const searchByNameFn = async (namaBarang) => {
  const response = await Api.get(`search/?nama_barang=${namaBarang}`);
  return response.data;
};

export const sortingDataFn = async (orderBy, orderDirection) => {
  const response = await Api.get(`sort?orderBy=${orderBy}&orderDirection=${orderDirection}`);
  return response.data;
};

export const chartDataFn = async (bulan, tahun) => {
  const response = await Api.get(`chart?bulan=${bulan}&tahun=${tahun}`);
  return response.data;
};
