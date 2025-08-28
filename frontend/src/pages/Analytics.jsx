// src/pages/Analytics.jsx
import { useApplications } from "../context/ApplicationContext";
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import Loader from "../components/Loader"; // optional: a simple spinner component

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const stages = ["Applied", "Interview", "Offer", "Rejected"];

const Analytics = () => {
  const { applications, getApplications } = useApplications();
  const [filter, setFilter] = useState({ role: "", status: "", minExp: "", maxExp: "" });
  const [loading, setLoading] = useState(true);

  // Fetch applications whenever filters change
  useEffect(() => {
    setLoading(true);
    getApplications(filter).finally(() => setLoading(false));
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  // Safe check
  const safeApplications = Array.isArray(applications) ? applications : [];

  // Compute stats
  const stageCount = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
  const roleCount = {};
  let totalExp = 0;

  safeApplications.forEach(app => {
    stageCount[app.status] += 1;
    roleCount[app.role] = (roleCount[app.role] || 0) + 1;
    totalExp += app.yearsOfExperience;
  });

  const pieData = {
    labels: Object.keys(stageCount),
    datasets: [{ data: Object.values(stageCount), backgroundColor: ["#4ade80", "#facc15", "#22d3ee", "#f87171"] }]
  };

  const barData = {
    labels: Object.keys(roleCount),
    datasets: [{ label: "Candidates", data: Object.values(roleCount), backgroundColor: "#60a5fa" }]
  };

  const avgExp = safeApplications.length ? (totalExp / safeApplications.length).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>

      {/* Filters */}
      <div className="bg-gray-800 p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="text" name="role" placeholder="Filter by Role" value={filter.role} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white"/>
        <select name="status" value={filter.status} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white">
          <option value="">All Status</option>
          {stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
        </select>
        <input type="number" name="minExp" placeholder="Min Experience" value={filter.minExp} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white"/>
        <input type="number" name="maxExp" placeholder="Max Experience" value={filter.maxExp} onChange={handleFilterChange} className="p-2 rounded bg-gray-700 text-white"/>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10"><Loader /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Average Experience */}
          <div className="bg-gray-800 p-6 rounded-lg shadow text-center hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-semibold mb-2">Average Experience</h2>
            <p className="text-3xl font-bold">{avgExp} yrs</p>
          </div>

          {/* Applications by Stage */}
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-semibold mb-2">Applications by Stage</h2>
            <Pie data={pieData} />
          </div>

          {/* Candidates by Role */}
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl font-semibold mb-2">Candidates by Role</h2>
            <Bar data={barData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
