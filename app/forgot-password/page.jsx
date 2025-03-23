"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

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
      router.push("/reset-password");
    } else {
      setStatus(data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-center text-lg font-semibold">Forgot Password</h2>
        <form className="mt-6" onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Enter Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition"
          >
            Send Code
          </button>
          {status && <div className="text-sm text-center text-gray-600 mt-2">{status}</div>}
        </form>
      </div>
    </div>
  );
}
