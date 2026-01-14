import axios from "axios";
import type { AxiosAdapter } from "axios";
import { handleRequest } from "./mockServer";

const mockAdapter: AxiosAdapter = async (config) => {
  return handleRequest(config);
};

const httpClient = axios.create({
  baseURL: "/",
  adapter: mockAdapter,
});

export default httpClient;
