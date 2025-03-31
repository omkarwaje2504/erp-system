"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";

export default function ProductionReports() {
  const [workOrders, setWorkOrders] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [woRes, insRes, wsRes] = await Promise.all([
        fetch("/api/work-orders"),
        fetch("/api/quality-control-inspection"),
        fetch("/api/workstations"),
      ]);
      const [woData, insData, wsData] = await Promise.all([
        woRes.json(),
        insRes.json(),
        wsRes.json(),
      ]);
      setWorkOrders(woData.orders || []);
      setInspections(insData.inspections || []);
      setWorkstations(wsData.workstations || []);
    };
    fetchData();
  }, []);

  const getDefectChartData = () => {
    const types = {};
    inspections.forEach((i) => {
      if (!types[i.defectType]) types[i.defectType] = 0;
      types[i.defectType]++;
    });
    return Object.entries(types).map(([name, count]) => ({ name, count }));
  };

  const getUtilizationChartData = () => {
    return workstations
      .filter((w) => !isNaN(parseFloat(w.utilization)))
      .map((w) => ({ name: w.workstationName, utilization: parseFloat(w.utilization) }));
  };

  const getEfficiencyAvg = () => {
    const eff = workOrders.map((w) => parseFloat(w.efficiency)).filter((v) => !isNaN(v));
    return eff.length > 0 ? (eff.reduce((a, b) => a + b, 0) / eff.length).toFixed(2) : "0.00";
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">Production and Manufacturing Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ReportCard title="Work Order Summary" subtitle="Completed, In-Progress, Delayed Work Orders">
          <p>✅ Completed: {workOrders.filter((w) => w.status === "Completed").length}</p>
          <p>🚧 In Progress: {workOrders.filter((w) => w.status === "Ongoing").length}</p>
          <p>⏱️ Delayed: {workOrders.filter((w) => w.status === "Pending").length}</p>
        </ReportCard>

        <ReportCard title="Production Efficiency Report" subtitle="Output per Work Order">
          <p>📦 Avg Efficiency: {getEfficiencyAvg()}%</p>
        </ReportCard>

        <ReportCard title="Workstation Analysis" subtitle="Utilization % by Station">
          <p>🛠️ Workstations: {workstations.length}</p>
        </ReportCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Defect Type Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getDefectChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Machine Utilization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getUtilizationChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilization" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => alert("Export coming soon...")}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
        >
          Export Reports
        </button>
      </div>
    </div>
  );
}

function ReportCard({ title, subtitle, children }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-1">{title}</h2>
      <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
      <div className="text-md text-gray-700 space-y-1">{children}</div>
    </div>
  );
}
