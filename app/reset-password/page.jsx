"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setStatus("Resetting password...");
    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, resetToken: code, newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus("Password reset successful! You can now log in.");
      router.push("/login");
    } else {
      setStatus(data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-center text-lg font-semibold">Reset Password</h2>
        <form className="mt-6" onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
            Reset Password
          </button>
        </form>
        {status && <p className="mt-2 text-sm text-center text-gray-600">{status}</p>}
      </div>
    </div>
  );
}
