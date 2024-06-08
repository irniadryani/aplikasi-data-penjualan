import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Chart = ({ dataTransaksi }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");


  const filteredDataTransaksi = dataTransaksi?.filter((item) => {
    if (!selectedMonth && !selectedYear) return true; 

    const date = new Date(item.tanggal);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return (
      (!selectedMonth || month.toString() === selectedMonth) &&
      (!selectedYear || year.toString() === selectedYear)
    );
  });

  const dataByJenisBarang = filteredDataTransaksi?.reduce((result, item) => {
    const jenisBarang = item.barang?.jenis_barang; 

    if (!jenisBarang) return result; 

    if (!result[jenisBarang]) {
      result[jenisBarang] = 0;
    }

    result[jenisBarang] += 1;

    return result;
  }, {});

  const chartData = Object.keys(dataByJenisBarang || {}).map((jenisBarang) => ({
    jenisBarang,
    jumlah_transaksi: dataByJenisBarang[jenisBarang],
  }));

  const uniqueMonths = [
    ...new Set(
      dataTransaksi?.map((item) => new Date(item.tanggal).getMonth() + 1) || [] // Perbaiki di sini dengan menambahkan '?'
    ),
  ];
  const uniqueYears = [
    ...new Set(
      dataTransaksi?.map((item) => new Date(item.tanggal).getFullYear()) || [] // Perbaiki di sini dengan menambahkan '?'
    ),
  ];

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  return (
    <div className="w-full flex flex-col items-center justify-center mb-2">
      <div className="flex w-full items-center justify-start gap-2 my-3">
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="select select-primary border border-[#06476F] max-h-2"
        >
          <option value="">All Months</option>
          {uniqueMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="select select-primary border border-[#06476F] max-h-2"
        >
          <option value="">All Years</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer className="w-full mt-5" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="jenisBarang" />
          <YAxis type="number" domain={[0, "dataMax + 2"]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="jumlah_transaksi" fill="#06476F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
