// src/context/ApplicationContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "./AuthContext";

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });

  const getApplications = async (filters = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`/applications?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(data.applications || []);
      setMeta({
        total: data.total,
        page: data.page,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addApplication = async (appData) => {
    try {
      await axios.post("/applications", appData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getApplications(); // refresh
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/applications/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getApplications();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteApplication = async (id) => {
    try {
      await axios.delete(`/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getApplications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ApplicationContext.Provider
      value={{ applications, meta, getApplications, addApplication, updateStatus, deleteApplication }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => useContext(ApplicationContext);
