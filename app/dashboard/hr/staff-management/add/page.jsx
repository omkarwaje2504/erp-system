"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { FaUpload } from "react-icons/fa";
import Image from "next/image";
import UploadFile from "@/services/uploadFile";

export default function AddStaff() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    department: "sales",  // Default department
    role: "employee",    // Default role
    position: "",
    salary: "",
    photo: "",
    email: "",
    employeeId: "",
    password: "",
  });
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const staffData = localStorage.getItem("staff-data");
    if (staffData) {
      const staff = JSON.parse(staffData);
      setForm({
        id: staff.id || "",
        name: staff.name || "",
        address: staff.address || "",
        department: staff.department || "sales",  // Default department
        role: staff.role || "employee",    // Default role
        position: staff.position || "",
        salary: staff.salary || "",
        photo: staff.photo || "",
        email: staff.email || "",
        phone: staff.phone || "",
        employeeId: staff.employeeId || "",
        password: staff.password || "",
      });
      localStorage.removeItem("staff-data");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (fileBlob) => {
    const file = fileBlob.target.files[0];
    try {
      setUploading(true);
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 8);
      const fileName = file.name.split(".")[0].replace(/\s+/g, "-");
      const imageFileName = `staff-management/${fileName}-${uniqueId}-${timestamp}.png`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await UploadFile(buffer, imageFileName, "image");
      setForm((prev) => ({ ...prev, photo: uploadResult }));
    } catch (err) {
      console.error("Upload failed:", err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard/hr/staff-management");
      } else {
        alert(data.error || "Failed to add staff");
      }
    } catch (err) {
      console.error("Error adding staff:", err);
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Staff</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 shadow rounded"
      >
        <InputField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <InputField
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
        <InputField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <InputField
          label="Position"
          name="position"
          value={form.position}
          onChange={handleChange}
        />
        <InputField
          label="Salary"
          name="salary"
          value={form.salary}
          onChange={handleChange}
        />
        <InputField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <InputField
          label="Employee ID"
          name="employeeId"
          value={form.employeeId}
          onChange={handleChange}
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Department Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Department
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="sales">Sales</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
            <option value="finance">Finance</option>
            <option value="inventory">Inventory</option>
            <option value="production">Production</option>
            <option value="support">Support</option>
          </select>
        </div>

        {/* Role Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {/* Document Upload */}
        {form.photo && (
          <div className="text-blue-600 text-sm mb-2">
            <Image
              src={form.photo}
              alt="Uploaded Document"
              width={100}
              height={100}
            />
            Image uploaded successfully
          </div>
        )}

        <div className="flex flex-col items-center">
          <label className="block text-gray-700 font-semibold mb-2">
            Document Upload
          </label>
          <label className="block border border-dashed border-gray-400 p-10 cursor-pointer rounded-lg hover:bg-gray-100 transition duration-200 text-center w-full">
            <FaUpload className="w-10 h-10 mx-auto mb-2 text-blue-600" />
            {form.photo ? "Image uploaded" : "Click to upload an image"}
            <input
              type="file"
              name="image"
              className="hidden"
              onChange={(e) => uploadImage(e)}
            />
          </label>
          {uploading && (
            <div className="text-blue-600 text-sm mt-2">Uploading...</div>
          )}
        </div>

        <Button type="submit" label="Submit" />
      </form>
    </div>
  );
}
