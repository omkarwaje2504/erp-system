"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TfiEmail } from "react-icons/tfi";
import { RiLockPasswordLine } from "react-icons/ri";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setStatus("");
    }, 3000);
  }, [status]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Login successful!");
      router.push(`/${data.user.department}-dashboard`);
    } else {
      setStatus(data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-center text-lg font-semibold">Login to ERP</h2>
        <form className="mt-6" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="inline-flex items-center gap-1 text-gray-700 text-sm mb-1">
              {" "}
              <TfiEmail className="w-4 h-4" />
              Enter your Email
            </label>
            <input
              type="email"
              placeholder="Eg: demo@erp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center gap-1 text-gray-700 text-sm mb-1">
              <RiLockPasswordLine className="w-4 h-4" /> Enter your Password
            </label>
            <input
              type="password"
              placeholder="Eg:*****"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>
          {status && <div className="text-red-500 text-sm mt-2">{status}</div>}
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-gray-500 hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="mt-4 text-center">
          <a href="/signup" className="text-blue-500 hover:underline">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
