import axios, { AxiosInstance } from "axios";

const serverUrlBase = process.env?.API_HOST || "http://localhost";
const serverPort = process.env?.API_PORT || 8080;
const baseURL = `${serverUrlBase}:${serverPort}/api/v1/`;

const httpClient: AxiosInstance = axios.create({
  // baseURL: `http://${process.env.API_HOST}:${process.env.API_PORT}/`,
  baseURL,
  headers: {
    "Content-type": "application/json",
  },
});

export default httpClient;
