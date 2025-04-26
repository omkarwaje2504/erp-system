"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, XCircle, User, Mail, Phone, Home, Briefcase, Landmark, Lock, Upload, CheckCircle } from "lucide-react";
import InputField from "@/components/InputField";
import UploadFile from "@/services/uploadFile";
import Image from "next/image";

export default function AddStaff() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    department: "sales",
    role: "employee",
    position: "",
    salary: "",
    photo: "",
    email: "",
    employeeId: "",
    password: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const staffData = localStorage.getItem("staff-data");
    if (staffData) {
      const staff = JSON.parse(staffData);
      setForm({
        ...staff,
        department: staff.department || "sales",
        role: staff.role || "employee",
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 w-full mx-auto">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-gray-600 hidden md:block">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push("/dashboard/hr")}
              className="hover:underline flex items-center"
            >
              HR Management
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Add Staff</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/dashboard/hr/staff-management")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Add New Staff Member
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <User className="mr-2" size={20} />
            Staff Information
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter the staff member's details and employment information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              icon={<User className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Employee ID"
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
              required
              icon={<Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              icon={<Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              icon={<Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Home Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              icon={<Home className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              icon={<Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Salary"
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              icon={<Landmark className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              icon={<Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="sales">Sales</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                  <option value="finance">Finance</option>
                  <option value="inventory">Inventory</option>
                  <option value="production">Production</option>
                  <option value="support">Support</option>
                </select>
                <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer flex flex-col items-center space-y-2">
                  {form.photo ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <span className="text-sm text-gray-600">Photo uploaded</span>
                      <Image
                        src={form.photo}
                        alt="Staff Preview"
                        width={120}
                        height={120}
                        className="mt-2 rounded-full object-cover"
                      />
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {uploading ? "Uploading..." : "Click to upload profile photo"}
                      </span>
                      <span className="text-xs text-gray-500">PNG, JPG up to 2MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    name="photo"
                    className="hidden"
                    onChange={uploadImage}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/dashboard/hr/staff-management")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
            >
              <XCircle size={18} className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Save size={18} className="mr-2" />
              {loading ? "Saving..." : "Save Staff Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}