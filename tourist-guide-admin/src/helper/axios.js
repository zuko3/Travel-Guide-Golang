import axios from "axios";
import { envConstants } from "../constants";

const instance = axios.create({ baseURL: envConstants.BASE_URL });
instance.defaults.headers.post['Content-Type'] = 'application/json';

const axiosFile = axios.create({ baseURL: envConstants.BASE_URL });
axiosFile.defaults.headers.post['Content-Type'] = 'multipart/form-data';

export function getAxios() { return instance; }
export function getAxiosFile() { return axiosFile; }