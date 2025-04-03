"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlusCircle, FaUserEdit } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";

export default function WorkstationList() {
  const [workstations, setWorkstations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkstation, setSelectedWorkstation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/workstations");
        const data = await res.json();
        setWorkstations(data.workstations || []);
      } catch (err) {
        console.error("Failed to fetch workstations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pb-6 w-full">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() =>
                router.push("/dashboard/production-and-management")
              }
              className="hover:underline flex items-center"
            >
              Production and Manufacturing
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">
            Workstation Management
          </li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Workstation Management
        </h1>
        <button
          onClick={() =>
            router.push(
              "/dashboard/production-and-management/workstation-management/add"
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center gap-2"
        >
          <FaPlusCircle />
          New Workstation
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedWorkstation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-xl shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Workstation Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Name:</strong> {selectedWorkstation.workstationName}
              </p>
              <p>
                <strong>Assigned:</strong> {selectedWorkstation.assignedTo}
              </p>
              <p>
                <strong>Current Operation:</strong>{" "}
                {selectedWorkstation.currentOperation}
              </p>
              <p>
                <strong>Production Time:</strong>{" "}
                {selectedWorkstation.productionTime}
              </p>
              <p>
                <strong>Utilization:</strong> {selectedWorkstation.utilization}
              </p>
              <p>
                <strong>Description:</strong> {selectedWorkstation.description}
              </p>
              {selectedWorkstation.documentUrl && (
                <img
                  src={selectedWorkstation.documentUrl}
                  alt="Document"
                  className="w-[150px] rounded mt-2 border"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  localStorage.setItem(
                    "workstation-data",
                    JSON.stringify(selectedWorkstation)
                  );
                  router.push(
                    "/dashboard/production-and-management/workstation-management/add"
                  );
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedWorkstation(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div className="bg-gray-200 rounded-lg p-6 text-center shadow">
          <h3 className="text-lg font-semibold mb-1 text-gray-700">
            Total Workstations in Use
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {workstations.length}
          </p>
        </div>

        <div className="bg-gray-200 rounded-lg p-6 text-center shadow">
          <h3 className="text-lg font-semibold mb-1 text-gray-700">
            Pending & Active Operations
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {
              workstations.filter(
                (ws) =>
                  ws.currentOperation &&
                  !ws.currentOperation.toLowerCase().includes("completed")
              ).length
            }
          </p>
        </div>
      </div>
            
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg p-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="p-2">Workstation Name</th>
                  <th className="p-2">Assigned Operators & Machines</th>
                  <th className="p-2">Current Operation</th>
                  <th className="p-2">Production Time</th>
                  <th className="p-2">Machine Utilization %</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workstations.map((ws) => (
                  <tr key={ws.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{ws.workstationName}</td>
                    <td className="p-2">{ws.assignedTo}</td>
                    <td className="p-2">{ws.currentOperation}</td>
                    <td className="p-2">{ws.productionTime}</td>
                    <td className="p-2">{ws.utilization}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedWorkstation(ws);
                          setShowModal(true);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600 flex items-center gap-x-1"
                      >
                        View <FaRegEye />
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "workstation-data",
                            JSON.stringify(ws)
                          );
                          router.push(
                            "/dashboard/production-and-management/workstation-management/add"
                          );
                        }}
                        className="bg-green-500 text-white px-2 py-1 text-sm rounded hover:bg-green-600 flex items-center gap-x-1"
                      >
                        Edit <FaUserEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden grid grid-cols-1 gap-y-4 mt-4">
            {workstations.map((ws) => (
              <div
                key={ws.id}
                className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
              >
                <h3 className="text-lg font-bold mb-2">{ws.workstationName}</h3>
                <p>
                  <strong>Assigned:</strong> {ws.assignedTo}
                </p>
                <p>
                  <strong>Operation:</strong> {ws.currentOperation}
                </p>
                <p>
                  <strong>Time:</strong> {ws.productionTime}
                </p>
                <p>
                  <strong>Utilization:</strong> {ws.utilization}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedWorkstation(ws);
                      setShowModal(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem(
                        "workstation-data",
                        JSON.stringify(ws)
                      );
                      router.push(
                        "/dashboard/production-and-management/workstation-management/add"
                      );
                    }}
                    className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
