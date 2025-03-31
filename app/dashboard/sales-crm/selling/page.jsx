"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUserEdit, FaPlusCircle, FaArrowRight } from "react-icons/fa";
import { MdOutlineManageAccounts } from "react-icons/md";

export default function SellingCustomerManagement() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/get-customers", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setCustomers(data.customers);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="pb-6 w-full">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard/sales-crm")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push("/dashboard/sales-crm")}
              className="hover:underline flex items-center"
            >
             Selling and Customer Management
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">
            Customer Management
          </li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Selling and Customer Management
        </h1>
        <button
          onClick={() => router.push("/dashboard/sales-crm/selling/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center gap-2"
        >
          <FaPlusCircle />
          Add New Lead
        </button>
      </div>

      <div className="mb-6">
        <button
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-2 hover:cursor-pointer"
          onClick={() =>
            router.push("/dashboard/sales-crm/selling/sales-orders")
          }
        >
          <MdOutlineManageAccounts />
          Sales Order Management
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Responsive Table or Cards */}
          {customers.length > 0 ? (
            <div className="mt-6">
              <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg p-4 bg-white">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr className="text-left border-b text-lg font-semibold text-gray-700">
                      <th className="py-2">Customer Id</th>
                      <th className="py-2">Customer Name</th>
                      <th className="py-2">Description</th>
                      <th className="py-2">Contact No.</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.description}</td>
                        <td>{c.contact}</td>
                        <td>
                          <span
                            className={`px-3 py-1 inline-block text-white font-medium rounded ${
                              c.status === "Active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              localStorage.setItem(
                                "customer-data",
                                JSON.stringify(c)
                              );
                              router.push("/dashboard/sales-crm/selling/add");
                            }}
                            className="bg-green-500 text-white px-2 py-1 text-sm rounded my-3 hover:bg-green-600 transition duration-200 flex items-center gap-x-1"
                          >
                            Edit
                            <FaUserEdit />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View - Cards */}
              <div className="md:hidden grid grid-cols-1 gap-y-4">
                {customers.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
                  >
                    <h3 className="text-lg font-bold mb-2">{c.name}</h3>
                    <p>
                      <strong>ID:</strong> {c.id}
                    </p>
                    <p>
                      <strong>Description:</strong> {c.description}
                    </p>
                    <p>
                      <strong>Contact:</strong> {c.contact}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-3 py-[2px] inline-block text-white font-medium rounded ${
                          c.status === "Active" ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {c.status}
                      </span>
                    </p>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        localStorage.setItem(
                          "customer-data",
                          JSON.stringify(c)
                        );
                        router.push("/dashboard/sales-crm/selling/add");
                      }}
                      className="mt-3 bg-green-500 text-white px-[10px] py-[5px] text-sm rounded hover:bg-green-[600]"
                    >
                      Edit
                      <FaUserEdit className="inline-block ml-1" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No customers found.
            </div>
          )}
        </>
      )}
    </div>
  );
}
