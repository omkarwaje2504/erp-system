"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

function ViewModal({ feedback, onClose }) {
  if (!feedback) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-xl font-semibold mb-4">Employee Performance Report</h2>
        <p><strong>Name & ID:</strong> {feedback.employee.name} ({feedback.employee.employeeId})</p>
        <p><strong>Work Efficiency Score:</strong> {feedback.workEfficiencyScore} / 10</p>
        <p><strong>Target Completion Rate:</strong> {feedback.targetCompletionRate} / 10</p>
        <p><strong>Attendance & Punctuality:</strong> {feedback.attendancePunctuality} / 10</p>
        <p><strong>Feedback Ratings:</strong> {feedback.feedbackRatings}</p>
        <p><strong>Manager's Feedback:</strong> {feedback.managerFeedback}</p>
        <p><strong>Appraisal History:</strong> {feedback.lastAppraisalInfo}</p>
        <p><strong>Description:</strong> {feedback.description}</p>
      </div>
    </div>
  );
}

export default function PerformanceFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [viewFeedback, setViewFeedback] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/performance-feedback")
      .then(res => res.json())
      .then(data => setFeedbacks(data.feedbacks || []));
  }, []);

  const handleEdit = (feedback) => {
    localStorage.setItem("editFeedback", JSON.stringify(feedback));
    router.push("/dashboard/hr/performance-and-feedback-management/add");
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
          <li className="font-semibold flex items-center">Performance & Feedback</li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex  justify-between items-center border-b pb-2">

      <h1 className="text-4xl font-semibold">
        Performance and Feedback Management
      </h1>

      <Button
        onClick={() => router.push("/dashboard/hr/performance-and-feedback-management/add")}
        >
        Add Employee Performance
      </Button>
          </div>

      <div className="overflow-x-auto bg-white rounded shadow mt-10">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b text-gray-700">
            <tr>
              <th className="p-3">Employee Name & ID</th>
              <th className="p-3">Department & Designation</th>
              <th className="p-3">Performance Score</th>
              <th className="p-3">Manager's Latest Feedback</th>
              <th className="p-3">Appraisal History</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No performance feedback found.
                </td>
              </tr>
            ) : (
              feedbacks.map((fb) => (
                <tr key={fb.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="p-3">{fb.employee.name} ({fb.employee.employeeId})</td>
                  <td className="p-3">{fb.employee.department} - {fb.employee.position}</td>
                  <td className="p-3">{fb.performanceScore}</td>
                  <td className="p-3">{fb.managerFeedback}</td>
                  <td className="p-3">{fb.lastAppraisalInfo || "N/A"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setViewFeedback(fb)}
                      className="text-blue-500 underline mr-2"
                    >
                      View Detailed Report
                    </button>
                    <button onClick={() => handleEdit(fb)} className="text-blue-500 underline">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ViewModal feedback={viewFeedback} onClose={() => setViewFeedback(null)} />
    </div>
  );
}
