import { useState, useEffect } from "react";
import { useApplications } from "../context/ApplicationContext";

const Applications = () => {
  const {
    applications,
    getApplications,
    addApplication,
    updateStatus,
    deleteApplication,
  } = useApplications();

  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    role: "",
    yearsOfExperience: "",
    resumeLink: "",
  });

  const [filters, setFilters] = useState({
    role: "",
    status: "",
    minExp: "",
    maxExp: "",
  });

  useEffect(() => {
    getApplications();
  }, [filters]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addApplication(formData);
    setFormData({
      candidateName: "",
      email: "",
      role: "",
      yearsOfExperience: "",
      resumeLink: "",
    });
    getApplications();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Applications</h1>

      {/* Add New Candidate Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Candidate</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="candidateName"
            value={formData.candidateName}
            onChange={handleChange}
            placeholder="Candidate Name"
            className="p-2 rounded bg-gray-700 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Candidate Email"
            className="p-2 rounded bg-gray-700 focus:outline-none"
            required
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Role"
            className="p-2 rounded bg-gray-700 focus:outline-none"
            required
          />
          <input
            type="number"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            placeholder="Years of Experience"
            className="p-2 rounded bg-gray-700 focus:outline-none"
            required
          />
          <input
            type="text"
            name="resumeLink"
            value={formData.resumeLink}
            onChange={handleChange}
            placeholder="Resume Link"
            className="p-2 rounded bg-gray-700 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 rounded p-2 col-span-1 md:col-span-2 transition"
          >
            Add Candidate
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            placeholder="Role"
            className="p-2 rounded bg-gray-700 focus:outline-none"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-2 rounded bg-gray-700 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input
            type="number"
            name="minExp"
            value={filters.minExp}
            onChange={handleFilterChange}
            placeholder="Min Experience"
            className="p-2 rounded bg-gray-700 focus:outline-none"
          />
          <input
            type="number"
            name="maxExp"
            value={filters.maxExp}
            onChange={handleFilterChange}
            placeholder="Max Experience"
            className="p-2 rounded bg-gray-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Applications List / Kanban Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applications && applications.length > 0 ? (
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition"
            >
              <h3 className="font-semibold text-lg">{app.candidateName}</h3>
              <p>Email: {app.email}</p>
              <p>Role: {app.role}</p>
              <p>Experience: {app.yearsOfExperience} yrs</p>
              <p>Status: {app.status}</p>
              <a
                href={app.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Resume
              </a>
            </div>
          ))
        ) : (
          <div className="text-gray-400 col-span-2">No applications found.</div>
        )}
      </div>
    </div>
  );
};

export default Applications;
