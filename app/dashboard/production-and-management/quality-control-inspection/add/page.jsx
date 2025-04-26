"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, XCircle, ClipboardCheck, AlertTriangle, User, FileText, Upload, CheckCircle } from "lucide-react";
import InputField from "@/components/InputField";
import UploadFile from "@/services/uploadFile";

export default function AddInspection() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    batchId: "",
    inspectionStatus: "",
    defectType: "",
    assignedTo: "",
    description: "",
    documentUrl: "",
    reworkStatus: "started",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("quality-control-inspection");
    if (storedData) {
      setForm(JSON.parse(storedData));
      localStorage.removeItem("quality-control-inspection");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 8);
      const fileName = file.name.split(".")[0].replace(/\s+/g, "-");
      const imageFileName = `inspections/${fileName}-${uniqueId}-${timestamp}.png`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await UploadFile(buffer, imageFileName, "image");
      setForm((prev) => ({ ...prev, documentUrl: uploadResult }));
    } catch (err) {
      console.error("Upload failed:", err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) await uploadImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/quality-control-inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/dashboard/production-and-management/quality-control-inspection");
      } else {
        alert(data.error || "Failed to submit inspection");
      }
    } catch (error) {
      console.error("Submission error:", error);
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
              onClick={() => router.push("/dashboard/production-and-management")}
              className="hover:underline flex items-center"
            >
              Production
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">New Inspection</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/dashboard/production-and-management/quality-control-inspection")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Quality Inspection
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <ClipboardCheck className="mr-2" size={20} />
            Inspection Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Record quality control checks and defect documentation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Batch ID & Product"
              name="batchId"
              value={form.batchId}
              onChange={handleChange}
              required
              icon={<ClipboardCheck className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspection Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="inspectionStatus"
                  value={form.inspectionStatus}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                  <option value="rework needed">Rework Needed</option>
                </select>
                <AlertTriangle className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Defect Severity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="defectType"
                  value={form.defectType}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="">Select Severity</option>
                  <option value="minor">Minor</option>
                  <option value="major">Major</option>
                  <option value="critical">Critical</option>
                </select>
                <AlertTriangle className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>

            <InputField
              label="Assigned Inspector"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              icon={<User className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspection Notes
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detailed inspection findings"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Evidence Documentation
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer flex flex-col items-center space-y-2">
                  {form.documentUrl ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <span className="text-sm text-gray-600">Document uploaded</span>
                      <p className="text-xs text-gray-500 truncate">
                        {form.documentUrl.split('/').pop()}
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {uploading ? "Uploading..." : "Click to upload evidence"}
                      </span>
                      <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/dashboard/production-and-management/quality-control-inspection")}
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
              {loading ? "Submitting..." : "Save Inspection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}