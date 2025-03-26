"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

    useEffect(() => {
      const userData = localStorage.getItem("userData");
      if (userData) {
        router.push(`/${JSON.parse(userData).department}-dashboard`);
      }
    }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus("Verification code sent to your email!");
      router.push("/reset-password?email=" + email);
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
          Forgot Password
        </h2>
        <form className="mt-6" onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <InputField
              key="email"
              label="Enter Email"
              type="email"
              value={email}
              placeholder="Eg:demo@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            label={status === "Sending..." ? "Sending..." : "Send Code"}
            isLoading={status === "Sending..."}
          />

          {status && (
            <div className="text-sm text-center text-gray-600 mt-2">
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
