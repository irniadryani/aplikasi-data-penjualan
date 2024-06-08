import axios from "axios";
import { getBackendHost } from "../backend";

const headersReg = {
  "Content-Type": "application/json",
  Authorization: "",
  Accept: "*/*"
};

export const Api = axios.create({
  baseURL: getBackendHost(), 
  headers: headersReg
});

