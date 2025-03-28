"use client";

import InputField from "@/components/InputField";
import UploadFile from "@/services/uploadFile";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUpload, FaSave } from "react-icons/fa";

export default function AddCustomer() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
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
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImage = async (fileBlob) => {
    try {
      setUploading(true);
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 8);
      const fileName = fileBlob.name.split(".")[0].replace(/\s+/g, "-");
      const imageFileName = `uploads/${fileName}-${uniqueId}-${timestamp}.png`;
      const arrayBuffer = await fileBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await UploadFile(buffer, imageFileName, "image");
      setForm((prev) => ({
        ...prev,
        docUrl: uploadResult,
      }));
    } catch (error) {
      console.error("Upload failed:", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file);
      await uploadImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = "/api/customers";

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/dashboard/sales-crm/selling");
  };
  return (
    <div className="pb-6 w-full mx-auto">
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/")}
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
              Dashboard
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push("/dashboard/sales-crm/selling")}
              className="hover:underline flex items-center"
            >
              Customer Management
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Add Customer</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Selling and Customer Management
        </h1>
        <button
          onClick={handleSubmit}
          className="bg-green-700 text-white px-10 rounded-lg py-2 hover:bg-green-800 hover:cursor-pointer flex items-center gap-2"
        >
          <FaSave />
          Save
        </button>
      </div>

      {form?.id && (
        <div className="text-yellow-600 font-medium mb-2">
          Editing Customer: {form.name}
        </div>
      )}

      <form className="p-6 rounded-lg shadow-md space-y-6 bg-white">
        <InputField
          label="Customer Name"
          name="name"
          type="text"
          placeholder="Enter name"
          value={form.name}
          onChange={handleChange}
        />

        <InputField
          label="Contact Number"
          name="contact"
          type="text"
          placeholder="Enter contact number"
          value={form.contact}
          onChange={handleChange}
        />

        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Status
          </label>
          <select
            name="status"
            className="w-full border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            onChange={handleChange}
            value={form.status}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <InputField
          label="Description"
          name="description"
          type="text"
          placeholder="Enter description"
          value={form.description}
          onChange={handleChange}
        />

        <InputField
          label="Location"
          name="location"
          type="text"
          placeholder="Enter location"
          value={form.location}
          onChange={handleChange}
        />

        {form.docUrl && (
          <div className="text-blue-600 text-sm mb-2">
            <Image
              src={form.docUrl}
              alt="Uploaded file"
              width={100}
              height={100}
            />
            File uploaded successfully
          </div>
        )}
        <div className="flex flex-col items-center">
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Documents
          </label>
          <label className="block border border-dashed border-gray-400 p-10 cursor-pointer rounded-lg hover:bg-gray-100 transition duration-200 text-center w-full">
            <FaUpload className="mx-auto mb-2 text-blue-600" />
            {form.doc ? "File uploaded" : "Click to upload a file"}
            <input
              type="file"
              name="doc"
              className="hidden"
              onChange={(e) => handleFileUpload(e)}
            />
          </label>
          {uploading ? (
            <div className="text-blue-600 text-sm mt-2">Uploading file...</div>
          ) : (
            ""
          )}
        </div>
      </form>
    </div>
  );
}
