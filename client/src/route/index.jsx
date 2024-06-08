import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Barang from "../pages/Barang";


export const Router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route>
        <Route index element={<Dashboard />} />
        <Route path={"/barang"} element={<Barang />} />
        {/* <Route path={"/daftar-customer"} element={<DaftarCustomer />} />
        <Route path={"/daftar-transaksi"} element={<DaftarTransaksi />} /> */}
      </Route>
    </>
  )
);
export default Router;
