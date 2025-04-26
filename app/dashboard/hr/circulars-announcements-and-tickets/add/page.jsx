"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Save,
  XCircle,
  Megaphone,
  User,
  Calendar,
  FileText,
  Upload,
  CheckCircle,
} from "lucide-react";
import InputField from "@/components/InputField";
import UploadFile from "@/services/uploadFile";

export default function AddAnnouncement() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    postedBy: "",
    dateTime: "",
    description: "",
    documentUrl: "",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("announcement-data");
    if (storedData) {
      setForm(JSON.parse(storedData));
      localStorage.removeItem("announcement-data");
    }
    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data.users || []);
      };
      fetchUsers();

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadDocument = async (file) => {
    try {
      setUploading(true);
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 8);
      const fileName = file.name.split(".")[0].replace(/\s+/g, "-");
      const filePath = `announcements/${fileName}-${uniqueId}-${timestamp}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await UploadFile(buffer, filePath, "file");
      setForm((prev) => ({ ...prev, documentUrl: uploadResult }));
    } catch (error) {
      console.error("Upload failed:", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) await uploadDocument(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          dateTime: new Date(form.dateTime).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to create announcement");

      router.push("/dashboard/hr/circulars-announcements-and-tickets");
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
              onClick={() => router.push("/dashboard/hr")}
              className="hover:underline flex items-center"
            >
              Home
            </button>
          </li>
          <li>/</li>
          <li>
            <button
              onClick={() => router.push("/dashboard/hr/circulars-announcements-and-tickets")}
              className="hover:underline flex items-center"
            >
              Announcements
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">New Announcement</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/dashboard/hr/circulars-announcements-and-tickets")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Create Announcement
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Megaphone className="mr-2" size={20} />
            Announcement Details
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Share important updates and information with the organization
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Announcement Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              icon={
                <Megaphone
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="postedBy"
                  value={form.postedBy}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="">Select Author</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <User
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
                <ChevronLeft
                  className="absolute right-3 top-2.5 text-gray-400 transform rotate-270"
                  size={18}
                />
              </div>
            </div>

            <InputField
              label="Date & Time"
              name="dateTime"
              type="datetime-local"
              value={form.dateTime}
              onChange={handleChange}
              required
              icon={
                <Calendar
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              }
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Announcement Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write detailed announcement here..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments (Optional)
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                <label className="cursor-pointer flex flex-col items-center space-y-2">
                  {form.documentUrl ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Document uploaded
                      </span>
                      <p className="text-xs text-gray-500 truncate">
                        {form.documentUrl.split("/").pop()}
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {uploading
                          ? "Uploading..."
                          : "Click to upload document"}
                      </span>
                      <span className="text-xs text-gray-500">
                        PDF, DOCX up to 10MB
                      </span>
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
              onClick={() => router.push("/dashboard/announcements")}
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
              {loading ? "Publishing..." : "Publish Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
