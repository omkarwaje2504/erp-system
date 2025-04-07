"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnnouncementsAndTickets() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // You can replace this with your real API call
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data || []));
  }, []);

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
          <li className="font-semibold">Circulars & Tickets</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-semibold border-b pb-2">Circulars, Announcements and Tickets</h1>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => router.push("/dashboard/hr/circulars-announcements-and-tickets/grievance-and-ticket-system")}
          className="bg-gray-200 px-6 py-3 rounded font-medium shadow"
        >
          Employee Grievance & Ticket System
        </button>

        <button
          onClick={() => router.push("/dashboard/hr/announcements/add")}
          className="bg-gray-200 px-4 py-2 rounded font-medium shadow"
        >
          Add New Announcement
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow mt-6">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b text-gray-700">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Posted By</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Description</th>
              <th className="p-3">View</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No announcements found.
                </td>
              </tr>
            ) : (
              announcements.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.postedBy}</td>
                  <td className="p-3">{item.dateTime}</td>
                  <td className="p-3">{item.description}</td>
                  <td className="p-3">
                    <a href={item.documentUrl} className="text-blue-500 underline" target="_blank" rel="noreferrer">
                      View Full Document
                    </a>
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
