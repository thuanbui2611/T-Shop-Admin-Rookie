import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { store } from "../store/ConfigureStore";
import { PaginatedResponse } from "../models/Pagination";
import { router } from "../routes/router";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
const responseBody = (response: AxiosResponse) => response.data;
axios.interceptors.request.use((config) => {
  const userToken = store.getState().account.user?.token;
  if (userToken) config.headers.Authorization = `Bearer ${userToken}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    const pagination = response.headers["x-pagination"];
    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
      return response;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response!;
    switch (status) {
      case 400:
        if ((data as any).errors) {
          const modalStateErrors: string[] = [];
          for (const key in (data as any).errors) {
            if ((data as any).errors[key]) {
              modalStateErrors.push((data as any).errors[key]);
            }
          }

          toast.error(modalStateErrors.toString());
        }
        console.log(data);
        toast.error((data as any).message);
        break;
      case 401:
        toast.error((data as any).title);
        break;
      case 403:
        toast.error((data as any).message);
        break;
      case 404:
        toast.error((data as any).message);
        break;
      case 409:
        toast.error((data as any).message);
        break;
      case 500:
        console.log("Catch 500");
        toast.error((data as any).message);
        router.navigate("/server-error");
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  postFormData: (url: string, body: any) => {
    const headers = body instanceof FormData
      ? { 'Content-Type': 'multipart/form-data' }
      : {};
    return axios.post(url, body, { headers }).then(responseBody);
  },
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  patch: (url: string, body: {}) => axios.patch(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Account = {
  login: (values: {}) => requests.post("api/authentication/register", values),
  register: (values: {}) => requests.post("api/authentication/login", values),
};

const Brand = {
  all: () => requests.get("api/brand"),
  list: (params: URLSearchParams) => requests.get("api/brand/list", params),
  details: (id: string) => requests.get(`api/brand/${id}`),
  create: (values: {}) => requests.post("api/brand", values),
  update: (id: string, values: {}) => requests.put(`api/brand/${id}`, values),
  delete: (id: string) => requests.delete(`api/brand/${id}`),
};

const ModelProduct = {
  all: () => requests.get("api/model"),
  list: (params: URLSearchParams) => requests.get("api/model/list", params),
  details: (id: string) => requests.get(`api/model/${id}`),
  create: (values: {}) => requests.post("api/model", values),
  update: (id: string, values: {}) => requests.put(`api/model/${id}`, values),
  delete: (id: string) => requests.delete(`api/model/${id}`),
};

const Color = {
  all: () => requests.get("api/color"),
  details: (id: string) => requests.get(`api/color/${id}`),
  create: (values: {}) => requests.post("api/color", values),
  update: (id: string, values: {}) => requests.put(`api/color/${id}`, values),
  delete: (id: string) => requests.delete(`api/color/${id}`),
};

const Product = {
  list: (params: URLSearchParams) => requests.get("api/product", params),
  details: (id: string) => requests.get(`api/product/${id}`),
  create: (values: FormData) => requests.postFormData("api/product", values),
  update: (id: string, values: {}) => requests.put(`api/product/${id}`, values),
  delete: (id: string) => requests.delete(`api/product/${id}`),
};

const Type = {
  all: () => requests.get("api/type"),
  list: (params: URLSearchParams) => requests.get("api/type/list", params),
  details: (id: string) => requests.get(`api/type/${id}`),
  create: (values: {}) => requests.post("api/type", values),
  update: (id: string, values: {}) =>
    requests.put(`api/type/${id}`, values),
  delete: (id: string) => requests.delete(`api/type/${id}`),
};

const Transaction = {
  list: (params: URLSearchParams) => requests.get("api/transaction", params),
  details: (id: string) => requests.get(`api/transaction/${id}`),
  updateStatusTransaction: (id: string, values: {}) => requests.put(`api/transaction/${id}`, values),
}

const agent = {
  Account,
  Brand,
  ModelProduct,
  Color,
  Product,
  Type,
  Transaction
};

export default agent;
