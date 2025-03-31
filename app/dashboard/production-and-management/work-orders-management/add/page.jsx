"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { FaPlusCircle, FaSave, FaUpload } from "react-icons/fa";
import Image from "next/image";
import UploadFile from "@/services/uploadFile";

export default function WorkOrderManagement() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    workOrderName: "",
    workOrderId: "",
    assignedTo: "",
    startDate: "",
    completionDate: "",
    efficiency: "",
    description: "",
    documentUrl: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("work-order-data");
    if (storedData) {
      setForm(JSON.parse(storedData));
      localStorage.removeItem("work-order-data");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (fileBlob) => {
    try {
      setUploading(true);
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 8);
      const fileName = fileBlob.name.split(".")[0].replace(/\s+/g, "-");
      const imageFileName = `products/${fileName}-${uniqueId}-${timestamp}.png`;
      const arrayBuffer = await fileBlob.arrayBuffer();
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
      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(
          "/dashboard/production-and-management/work-orders-management"
        );
      } else {
        alert(data.error || "Failed to save work order");
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-6 w-full">
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
          <li
            className="font-semibold flex items-center hover:underline hover:cursor-pointer"
            onClick={() =>
              router.push(
                "/dashboard/production-and-management/work-orders-management"
              )
            }
          >
            Work-Orders Management
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">add</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Work Orders Management
        </h1>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center gap-2"
        >
          <FaSave className="pr-1" />
          Save
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <>
          <form className="space-y-4 bg-white p-6 shadow rounded">
            <InputField
              label="Work Order Name"
              name="workOrderName"
              value={form.workOrderName}
              onChange={handleChange}
              required
            />
            <InputField
              label="Work Order ID"
              name="workOrderId"
              value={form.workOrderId}
              onChange={handleChange}
              required
            />
            <InputField
              label="Assigned Workstation and Employee"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Start Date"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
              />
              <InputField
                label="Expected Completion Date"
                name="completionDate"
                type="date"
                value={form.completionDate}
                onChange={handleChange}
              />
            </div>
            <InputField
              label="Production Efficiency (cycle time or defect rate %)"
              name="efficiency"
              value={form.efficiency}
              onChange={handleChange}
            />
            <InputField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />

            {form.documentUrl && (
              <div className="text-blue-600 text-sm mb-2">
                <Image
                  src={form.documentUrl}
                  alt="Uploaded product image"
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
                {form.documentUrl
                  ? "Image uploaded"
                  : "Click to upload an image"}
                <input
                  type="file"
                  name="image"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e)}
                />
              </label>
              {uploading && (
                <div className="text-blue-600 text-sm mt-2">
                  Uploading image...
                </div>
              )}
            </div>
          </form>
        </>
      )}
    </div>
  );
}
