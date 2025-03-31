"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import UploadFile from "@/services/uploadFile";
import { FaUpload, FaSave } from "react-icons/fa";
import Image from "next/image";

export default function AddProductForm() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    productId: "",
    category: "",
    description: "",
    b2bPrice: "",
    b2cPrice: "",
    stock: "",
    imageUrl: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("productData");
    if (storedData) {
      setForm(JSON.parse(storedData));
      localStorage.removeItem("productData");
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
      const imageFileName = `products/${fileName}-${uniqueId}-${timestamp}.png`;
      const arrayBuffer = await fileBlob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await UploadFile(buffer, imageFileName, "image");
      setForm((prev) => ({ ...prev, imageUrl: uploadResult }));
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
    const endpoint = "/api/item-and-pricing";
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/dashboard/sales-crm/items");
  };

  return (
    <div className="pb-6 w-full mx-auto">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-gray-600">
        <ol className="flex space-x-2 text-sm">
          <li>
            <button
              onClick={() => router.push("/dashboard/sales-crm")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push("/dashboard/sales-crm/items")}
              className="hover:underline flex items-center"
            >
              Item & Pricing Management
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Add Product</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Item and Pricing Management
        </h1>
        <Button
          type="submit"
          label="Save Product"
          className="!w-fit"
          onClick={handleSubmit}
          icon={<FaSave />}
        />
      </div>

      {/* Edit info */}
      {form?.id && (
        <div className="text-yellow-600 font-medium mb-2">
          Editing Product: {form.name}
        </div>
      )}

      {/* Form */}
      <form className="p-6 rounded-lg shadow-md space-y-6 bg-white">
        <InputField
          label="Product Name"
          name="name"
          type="text"
          placeholder="Enter product name"
          value={form.name}
          onChange={handleChange}
        />
        <InputField
          label="Product ID"
          name="productId"
          type="text"
          placeholder="Enter product ID"
          value={form.productId}
          onChange={handleChange}
        />
        <InputField
          label="Category"
          name="category"
          type="text"
          placeholder="Enter category"
          value={form.category}
          onChange={handleChange}
        />
        <InputField
          label="Description"
          name="description"
          type="text"
          placeholder="Enter description"
          value={form.description}
          onChange={handleChange}
        />
        <div className="w-full">
          <h2 className="font-medium text-lg">Price</h2>
          <div className="flex md:flex-row flex-col w-full gap-10">
            <InputField
              label="B2B Price"
              name="b2bPrice"
              type="number"
              placeholder="Enter B2B price"
              value={form.b2bPrice}
              onChange={handleChange}
            />
            <InputField
              label="B2C Price"
              name="b2cPrice"
              type="number"
              placeholder="Enter B2C price"
              value={form.b2cPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <InputField
          label="Stock Quantity"
          name="stock"
          type="number"
          placeholder="Enter stock quantity"
          value={form.stock}
          onChange={handleChange}
        />

        {form.imageUrl && (
          <div className="text-blue-600 text-sm mb-2">
            <Image
              src={form.imageUrl}
              alt="Uploaded product image"
              width={100}
              height={100}
            />
            Image uploaded successfully
          </div>
        )}

        <div className="flex flex-col items-center">
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Product Image
          </label>
          <label className="block border border-dashed border-gray-400 p-10 cursor-pointer rounded-lg hover:bg-gray-100 transition duration-200 text-center w-full">
            <FaUpload className="mx-auto mb-2 text-blue-600" />
            {form.imageUrl ? "Image uploaded" : "Click to upload an image"}
            <input
              type="file"
              name="image"
              className="hidden"
              onChange={(e) => handleFileUpload(e)}
            />
          </label>
          {uploading && (
            <div className="text-blue-600 text-sm mt-2">Uploading image...</div>
          )}
        </div>
      </form>
    </div>
  );
}
