import axios, { AxiosInstance } from "axios";

const extractBaseUrl = () => {
  const urlObj = new URL(window.location.href);
  return [
    urlObj.protocol,
    urlObj.hostname,
    `${urlObj.protocol}//${urlObj.hostname}`,
  ];
};

const urlBase = extractBaseUrl();
const serverUrlBase = urlBase[2];
const serverPort = urlBase[1] == "localhost" ? 8080 : 80;
const baseURL = `${serverUrlBase}:${serverPort}/api/v1/`;

const httpClient: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json",
  },
});

export default httpClient;
