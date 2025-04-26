"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Save, XCircle, User, ClipboardCheck, Target, CalendarCheck, Star, NotebookText } from "lucide-react";
import InputField from "@/components/InputField";

export default function AddPerformanceFeedback() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: "",
    workEfficiencyScore: "",
    targetCompletionRate: "",
    attendancePunctuality: "",
    feedbackRatings: "",
    description: "",
    lastAppraisalInfo: "",
    performanceScore: "",
    managerFeedback: ""
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const editData = localStorage.getItem("editFeedback");
    if (editData) {
      const parsed = JSON.parse(editData);
      setFormData(parsed);
      localStorage.removeItem("editFeedback");
    }
  }, []);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setEmployees(data.users || []));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/performance-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error("Failed to save feedback");
      router.push("/dashboard/hr/performance-and-feedback-management");
    } catch (error) {
      console.error("Submission error:", error);
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
              onClick={() => router.push("/dashboard/hr")}
              className="hover:underline flex items-center"
            >
              HR Management
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Add Feedback</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.push("/dashboard/hr/performance-and-feedback-management")}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Performance Feedback
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <ClipboardCheck className="mr-2" size={20} />
            Employee Evaluation
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Record and manage employee performance metrics and feedback
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  required
                >
                  <option value="">Select an employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <ChevronLeft className="absolute right-3 top-2.5 text-gray-400 transform rotate-270" size={18} />
              </div>
            </div>

            <InputField
              label="Work Efficiency Score"
              name="workEfficiencyScore"
              type="number"
              placeholder="0-10"
              value={formData.workEfficiencyScore}
              onChange={handleChange}
              icon={<Target className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Target Completion Rate"
              name="targetCompletionRate"
              type="number"
              placeholder="0-100%"
              value={formData.targetCompletionRate}
              onChange={handleChange}
              icon={<Star className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Attendance & Punctuality"
              name="attendancePunctuality"
              type="number"
              placeholder="0-10"
              value={formData.attendancePunctuality}
              onChange={handleChange}
              icon={<CalendarCheck className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Feedback Ratings"
              name="feedbackRatings"
              type="text"
              placeholder="Peer/manager ratings"
              value={formData.feedbackRatings}
              onChange={handleChange}
              icon={<Star className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Manager Feedback"
              name="managerFeedback"
              type="text"
              placeholder="Latest feedback"
              value={formData.managerFeedback}
              onChange={handleChange}
              icon={<User className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Appraisal History"
              name="lastAppraisalInfo"
              type="text"
              placeholder="Promotion/increment details"
              value={formData.lastAppraisalInfo}
              onChange={handleChange}
              icon={<NotebookText className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />

            <InputField
              label="Overall Score"
              name="performanceScore"
              type="number"
              placeholder="Final score"
              value={formData.performanceScore}
              onChange={handleChange}
              icon={<ClipboardCheck className="absolute left-3 top-2.5 text-gray-400" size={18} />}
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed performance evaluation notes"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={() => router.push("/dashboard/hr/performance-and-feedback-management")}
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
              {loading ? "Saving..." : "Save Evaluation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}