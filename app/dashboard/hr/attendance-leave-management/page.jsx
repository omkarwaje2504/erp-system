"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { FaUpload } from "react-icons/fa";
import Image from "next/image";

export default function AttendanceLeaveManagement() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceRes = await fetch("/api/attendance");
        const leaveRes = await fetch("/api/leave");

        const attendanceData = await attendanceRes.json();
        const leaveData = await leaveRes.json();

        setAttendanceRecords(attendanceData.attendanceRecords || []);
        setLeaveRequests(leaveData.leaveRequests || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const filteredAttendanceRecords = attendanceRecords.filter(
    (record) =>
      selectedDate === "" || record.date === selectedDate
  );

  const filteredLeaveRequests = leaveRequests.filter(
    (request) =>
      selectedDate === "" || request.leaveStartDate === selectedDate || request.leaveEndDate === selectedDate
  );

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Attendance & Leave Management</h1>

      {/* Date Selector */}
      <div className="mb-4">
        <label className="block text-gray-700 text-lg mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Attendance Records Section */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Attendance Records</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Employee Name & ID</th>
              <th className="p-2 text-left">Check In Time</th>
              <th className="p-2 text-left">Check Out Time</th>
              <th className="p-2 text-left">Attendance Status</th>
              <th className="p-2 text-left">Total Working Hours</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendanceRecords.map((record) => (
              <tr key={record.id}>
                <td className="p-2">{record.employeeName} ({record.employeeId})</td>
                <td className="p-2">{record.checkInTime}</td>
                <td className="p-2">{record.checkOutTime}</td>
                <td className="p-2">{record.attendanceStatus}</td>
                <td className="p-2">{record.totalWorkingHours}</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Request Section */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Leave Request and Approval</h2>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Employee Name & ID</th>
              <th className="p-2 text-left">Leave Type</th>
              <th className="p-2 text-left">Start & End Date</th>
              <th className="p-2 text-left">Reason for Leave</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeaveRequests.map((request) => (
              <tr key={request.id}>
                <td className="p-2">{request.employeeName} ({request.employeeId})</td>
                <td className="p-2">{request.leaveType}</td>
                <td className="p-2">
                  {request.leaveStartDate} → {request.leaveEndDate}
                </td>
                <td className="p-2">{request.reasonForLeave}</td>
                <td className="p-2">
                  <button className="text-green-600 hover:underline">Approve</button>
                  <button className="text-red-600 hover:underline ml-4">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
