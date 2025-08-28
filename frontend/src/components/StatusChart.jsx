import { Pie } from "react-chartjs-2";
import { useApplications } from "../context/ApplicationContext";

const StatusChart = () => {
  const { stats } = useApplications();

  const data = {
    labels: Object.keys(stats.statusCounts || {}),
    datasets: [
      {
        data: Object.values(stats.statusCounts || {}),
        backgroundColor: ["#3b82f6", "#facc15", "#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Applications by Status</h3>
      <Pie data={data} />
    </div>
  );
};

export default StatusChart;
