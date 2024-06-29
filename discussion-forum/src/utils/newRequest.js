import axios from "axios";

const newRequests = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export default newRequests;
