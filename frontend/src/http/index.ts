import axios, { AxiosInstance } from "axios";

const httpClient: AxiosInstance = axios.create({
  baseURL: `http://${process.env.API_HOST}:${process.env.API_PORT}/`,
  headers: {
    "Content-type": "application/json",
  },
});

export default httpClient;
