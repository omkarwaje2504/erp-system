"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

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

  useEffect(() => {
    const editData = localStorage.getItem("editFeedback");
    if (editData) {
      const parsed = JSON.parse(editData);
      setFormData({
        id: parsed.id,
        employeeId: parsed.employeeId,
        workEfficiencyScore: parsed.workEfficiencyScore,
        targetCompletionRate: parsed.targetCompletionRate,
        attendancePunctuality: parsed.attendancePunctuality,
        feedbackRatings: parsed.feedbackRatings,
        description: parsed.description,
        lastAppraisalInfo: parsed.lastAppraisalInfo,
        performanceScore: parsed.performanceScore,
        managerFeedback: parsed.managerFeedback
      });
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
    await fetch("/api/performance-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    router.push("/dashboard/hr/performance-and-feedback-management");
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
              onClick={() => router.push("/dashboard/hr/performance-and-feedback-management")}
              className="hover:underline flex items-center"
            >
              Performance & Feedback
            </button>
          </li>
          <li>/</li>
          <li className="font-semibold flex items-center">Add Feedback</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Performance and Feedback Management
        </h1>
        <Button
          type="submit"
          label="Save Feedback"
          className="!w-fit"
          onClick={handleSubmit}
        />
      </div>

      {/* Edit info */}
      {formData?.id && (
        <div className="text-yellow-600 font-medium mb-2">
          Editing Feedback for Employee ID: {formData.employeeId}
        </div>
      )}

      {/* Form */}
      <form className="p-6 rounded-lg shadow-md space-y-6 bg-white">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select an employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
          </select>
        </div>

        <InputField
          label="Work Efficiency Score"
          name="workEfficiencyScore"
          type="number"
          placeholder="Score out of 10"
          value={formData.workEfficiencyScore}
          onChange={handleChange}
        />
        <InputField
          label="Target Completion Rate"
          name="targetCompletionRate"
          type="number"
          placeholder="Score out of 10"
          value={formData.targetCompletionRate}
          onChange={handleChange}
        />
        <InputField
          label="Attendance & Punctuality"
          name="attendancePunctuality"
          type="number"
          placeholder="Score out of 10"
          value={formData.attendancePunctuality}
          onChange={handleChange}
        />
        <InputField
          label="Peer & Manager Feedback Ratings"
          name="feedbackRatings"
          type="text"
          placeholder="Enter feedback ratings"
          value={formData.feedbackRatings}
          onChange={handleChange}
        />
        <InputField
          label="Manager's Latest Feedback"
          name="managerFeedback"
          type="text"
          placeholder="Latest feedback"
          value={formData.managerFeedback}
          onChange={handleChange}
        />
        <InputField
          label="Appraisal History"
          name="lastAppraisalInfo"
          type="text"
          placeholder="Promotion / Increment info"
          value={formData.lastAppraisalInfo}
          onChange={handleChange}
        />
        <InputField
          label="Overall Performance Score"
          name="performanceScore"
          type="number"
          placeholder="Final performance score"
          value={formData.performanceScore}
          onChange={handleChange}
        />
        <InputField
          label="Description"
          name="description"
          type="text"
          placeholder="Additional notes"
          value={formData.description}
          onChange={handleChange}
        />
      </form>
    </div>
  );
}