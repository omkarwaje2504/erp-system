"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import UploadFile from "@/services/uploadFile";

export default function RaiseTicket() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    issueType: "",
    description: "",
    documentUrl: "",
  });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setEmployees(data.users || []));
  }, []);

  useEffect(() => {
    const editData = localStorage.getItem("ticketData");
    if (editData) {
      const parsed = JSON.parse(editData);
      setFormData({
        id: parsed.id,
        employeeId: parsed.employeeId,
        issueType: parsed.issueType,
        description: parsed.description,
        documentUrl: parsed.documentUrl,
      });
      localStorage.removeItem("ticketData");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const timestamp = Date.now();
    const fileName = file.name.split(".")[0].replace(/\s+/g, "-");
    const uniqueFile = `tickets/${fileName}-${timestamp}.pdf`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const upload = await UploadFile(buffer, uniqueFile, "file");
    setFormData((prev) => ({ ...prev, documentUrl: upload }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    router.push(
      "/dashboard/hr/circulars-announcements-and-tickets/grievance-and-ticket-system"
    );
  };

  return (
    <div className="pb-6 w-full mx-auto">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard/hr")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() =>
                router.push(
                  "/dashboard/hr/circulars-announcements-and-tickets/grievance-and-ticket-system"
                )
              }
              className="hover:underline flex items-center"
            >
              Grievance & Ticket System
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Raise a Ticket</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">Raise a Ticket</h1>
        <Button
          label="Submit Ticket"
          onClick={handleSubmit}
          className="!w-fit"
        />
      </div>

      {/* Form */}
      <form className="p-6 rounded-lg shadow-md space-y-6 bg-white">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee
          </label>
          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Issue Type
          </label>
          <select
            name="issueType"
            value={formData.issueType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select issue</option>
            <option value="Payroll">Payroll</option>
            <option value="Workplace Concern">Workplace Concern</option>
            <option value="Technical">Technical</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <InputField
          label="Brief Description of the Issue"
          name="description"
          type="text"
          placeholder="Describe the issue"
          value={formData.description}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attach Supporting Document (optional)
          </label>
          <input
            type="file"
            className="border p-2 w-full rounded"
            onChange={handleUpload}
          />
          {uploading && (
            <p className="text-blue-500 text-sm mt-2">Uploading...</p>
          )}
          {formData.documentUrl && (
            <p className="text-green-600 text-sm mt-1">
              File uploaded successfully.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
