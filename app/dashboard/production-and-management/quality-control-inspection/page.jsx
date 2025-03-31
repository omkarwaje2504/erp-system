"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaUserEdit } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";

export default function InspectionList() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const res = await fetch("/api/quality-control-inspection");
        const data = await res.json();
        setInspections(data.inspections || []);
      } catch (err) {
        console.error("Error loading inspections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, []);

  return (
    <div className="p-6 w-full">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() =>
                router.push("/dashboard/production-and-management")
              }
              className="hover:underline flex items-center"
            >
              Production and Management
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">
            Quality & Control inspection
          </li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Quality & Control inspection
        </h1>
        <button
          onClick={() =>
            router.push(
              "/dashboard/production-and-management/quality-control-inspection/add"
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center gap-2"
        >
          <FaPlusCircle />
          Add New inspection
        </button>
      </div>

      {/* Modal */}
      {showModal && selectedInspection && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-xl shadow-lg relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Inspection Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Batch ID:</strong> {selectedInspection.batchId}
              </p>
              <p>
                <strong>Inspection Status:</strong>{" "}
                {selectedInspection.inspectionStatus}
              </p>
              <p>
                <strong>Defect Type:</strong> {selectedInspection.defectType}
              </p>
              <p>
                <strong>Assigned To:</strong> {selectedInspection.assignedTo}
              </p>
              <p>
                <strong>Rework Status:</strong>{" "}
                {selectedInspection.reworkStatus}
              </p>
              <p>
                <strong>Description:</strong> {selectedInspection.description}
              </p>
              {selectedInspection.documentUrl && (
                <img
                  src={selectedInspection.documentUrl}
                  alt="Document"
                  className="w-[150px] rounded mt-2 border"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  localStorage.setItem(
                    "quality-control-inspection",
                    JSON.stringify(selectedInspection)
                  );
                  router.push(
                    "/dashboard/production-and-management/quality-control-inspection/add"
                  );
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedInspection(null);
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : inspections.length > 0 ? (
        <div className="mt-6">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg p-4">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="p-2">Batch ID & Product Name</th>
                  <th className="p-2">Inspection Status</th>
                  <th className="p-2">Defect Type</th>
                  <th className="p-2">Assigned Inspector & Workstation</th>
                  <th className="p-2">Rework Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{item.batchId}</td>
                    <td className="p-2 capitalize">{item.inspectionStatus}</td>
                    <td className="p-2 capitalize">{item.defectType}</td>
                    <td className="p-2">{item.assignedTo}</td>
                    <td className="p-2 capitalize">{item.reworkStatus}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedInspection(item);
                          setShowModal(true);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600 flex items-center gap-x-1"
                      >
                        View <FaRegEye />
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "quality-control-inspection",
                            JSON.stringify(item)
                          );
                          router.push(
                            "/dashboard/production-and-management/quality-control-inspection/add"
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
            {inspections.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
              >
                <h3 className="text-lg font-bold mb-2">{item.batchId}</h3>
                <p>
                  <strong>Status:</strong> {item.inspectionStatus}
                </p>
                <p>
                  <strong>Defect:</strong> {item.defectType}
                </p>
                <p>
                  <strong>Assigned:</strong> {item.assignedTo}
                </p>
                <p>
                  <strong>Rework:</strong> {item.reworkStatus}
                </p>

                <button
                  onClick={() => {
                    setSelectedInspection(item);
                    setShowModal(true);
                  }}
                  className="mt-3 bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "quality-control-inspection",
                      JSON.stringify(item)
                    );
                    router.push(
                      "/dashboard/production-and-management/quality-control-inspection/add"
                    );
                  }}
                  className="mt-2 bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600"
                >
                  Edit <FaUserEdit className="inline-block ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No inspections found.
        </div>
      )}
    </div>
  );
}
