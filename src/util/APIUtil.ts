import axios from "axios";
import { LoginUserDTO, User } from "../interfaces/user";

const BASE_URL = "http://localhost:8000";

// get token
const userStr = localStorage.getItem("user");
console.log(typeof userStr);
let headers = {};
if (userStr) {
  const user = JSON.parse(userStr) as User;
  if (user && user.token) {
    headers = { headers: { Authorization: user.token } };
  }
}

// Endpoints
export const loginUser = async (loginUserDTO: LoginUserDTO) => {
  const result = await axios.post(BASE_URL + "/auth/login", loginUserDTO);
  return result.data;
};

export const getTables = async () => {
  const result = await axios.get(BASE_URL + "/tables", headers);
  return result.data;
};

export const getTableInfo = async (tableName: string) => {
  const result = await axios.get(BASE_URL + `/tables/${tableName}`, headers);
  return result.data;
};

export const deleteFromTable = async (tableName: string, id: string) => {
  const result = await axios.delete(
    BASE_URL + `/tables/${tableName}/${id}`,
    headers
  );
  return result.data;
};

export const addToTable = async (tableName: string, body: any) => {
  const result = await axios.put(
    BASE_URL + `/tables/${tableName}`,
    body,
    headers
  );
  return result.data;
};
