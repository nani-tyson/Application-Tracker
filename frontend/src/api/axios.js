import axios from "axios";

const instance = axios.create({
  baseURL: "https://application-tracker-vsju.onrender.com/api", // backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
