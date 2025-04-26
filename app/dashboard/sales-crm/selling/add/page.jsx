"use client";

import { ChevronLeft, Save, XCircle, User, Phone, MapPin, FileText, Upload, CheckCircle } from "lucide-react";
import InputField from "@/components/InputField";
import UploadFile from "@/services/uploadFile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddCustomer() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    status: "Active",
    description: "",
    location: "",
    docUrl: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("customer-data");
    if (storedData) {
      setForm(JSON.parse(storedData));
      localStorage.removeItem("customer-data");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file) => {
    try {
      setUploading(true);
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 8);
      const fileName = file.name.split(".")[0].replace(/\s+/g, "-");
      const filePath = `customers/${fileName}-${uniqueId}-${timestamp}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await UploadFile(buffer, filePath, "file");
      setForm((prev) => ({ ...prev, docUrl: uploadResult }));
    } catch (error) {
      console.error("Upload failed:", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) await uploadFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (!res.ok) throw new Error("Failed to save customer");
      router.push("/dashboard/sales-crm/selling");
    } catch (error) {
      alert(error.message);
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
              onClick={() => router.push("/dashboard/sales-crm")}
              className="hover:underline flex items-center"
            >
              Sales CRM
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Add Customer</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/dashboard/sales-crm/selling")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Customer Management
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <User className="mr-2" size={20} />
            Customer Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage customer information and business relationships
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Customer Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              icon={<User className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Contact Number"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              icon={<Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>

            <InputField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              icon={<MapPin className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Notes
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional customer information"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Documents
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer flex flex-col items-center space-y-2">
                  {form.docUrl ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <span className="text-sm text-gray-600">Document uploaded</span>
                      <p className="text-xs text-gray-500 truncate">
                        {form.docUrl.split('/').pop()}
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {uploading ? "Uploading..." : "Click to upload document"}
                      </span>
                      <span className="text-xs text-gray-500">PDF, DOCX up to 10MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/dashboard/sales-crm/selling")}
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
              {loading ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}