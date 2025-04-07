"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GrievanceAndTicketSystem() {
  const [tickets, setTickets] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets || []));
  }, []);

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "text-yellow-600";
      case "resolved": return "text-green-600";
      case "in-progress": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="pb-6 w-full mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button onClick={() => router.push("/dashboard/hr")} className="hover:underline">
              Home
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold">Grievance & Ticket System</li>
        </ol>
      </nav>

      {/* Heading */}
      <h1 className="text-4xl font-semibold">Employee Grievance & Ticket System</h1>
      <h2 className="text-xl font-medium mt-1 border-b pb-2">HR Ticket Management Section</h2>

      {/* Button */}
      <div className="flex justify-end mt-4">
        <button
          className="bg-gray-200 px-4 py-2 rounded shadow font-medium"
          onClick={() => router.push("/dashboard/hr/circulars-announcements-and-tickets/grievance-and-ticket-system/add")}
        >
          Raise a New Ticket
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow mt-4">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b text-gray-700">
            <tr>
              <th className="p-3">Employee Name & ID</th>
              <th className="p-3">Issue Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Action</th>
              <th className="p-3">Resolution Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{ticket.employee.name} ({ticket.employee.employeeId})</td>
                  <td className="p-3">{ticket.issueType}</td>
                  <td className="p-3">{ticket.description}</td>
                  <td className="p-3 font-medium">{ticket.status}</td>
                  <td className={`p-3 font-medium ${statusColor(ticket.status)}`}>{ticket.status}</td>
                  <td className="p-3">
                    <button
                      className="text-blue-500 underline mr-2"
                      onClick={() => router.push(`/dashboard/hr/grievance-and-ticket-system/edit?id=${ticket.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-green-600 underline"
                      onClick={() => alert("Mark as solved logic goes here")}
                    >
                      Mark as Solved
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
