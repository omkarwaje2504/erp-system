"use client";
import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();


  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      router.push(`/${JSON.parse(userData).department}-dashboard`);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

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
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-gray-100 p-3">
      <div className="bg-white rounded-lg shadow-sm p-6 w-full">
        <div className="w-full">
          <img
            src="./erp-banner-forget.jpg"
            alt="erp-banner-forget"
            className="w-full"
          />
        </div>
        <h2 className="text-center text-2xl font-semibold mt-4">
          Reset Password
        </h2>
        <form className="mt-6" onSubmit={handleResetPassword}>
          <InputField
            key="email"
            type="email"
            label="Enter email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            key="code"
            type="text"
            label="Enter verification code"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <InputField
            key="newPassword"
            type="password"
            label="Enter new password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button
            type="submit"
            label={
              status === "Resetting password..."
                ? "Resetting password..."
                : "Reset Password"
            }
            isLoading={status === "Resetting password..."}
          />
        </form>
        {status && (
          <p className="mt-2 text-sm text-center text-gray-600">{status}</p>
        )}
      </div>
    </div>
  );
}
