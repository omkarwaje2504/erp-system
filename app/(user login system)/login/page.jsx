"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      router.push(`/dashboard`);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setStatus("");
    }, 3000);
  }, [status]);

  const handleLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setIsLoading(false);
      localStorage.setItem("userData", JSON.stringify(data.user));
      router.push(`/dashboard`);
    } else {
      setIsLoading(false);
      setStatus(data.error);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center bg-gray-100 p-3">
      <div className="bg-white rounded-lg shadow-sm p-6 w-full">
        <div className="w-full">
          <img
            src="./erp-banner-login.jpg"
            alt="erp-banner-login"
            className="w-full"
          />
        </div>

        <h2 className="text-center text-2xl font-semibold mt-4">
          Login to ERP
        </h2>

        <form className="mt-6" onSubmit={handleLogin}>
          <InputField
            key="email"
            label="Enter your Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Eg: demo@erp.com"
          />

          <InputField
            key="password"
            label="Enter your Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Eg: *****"
          />
          <Button type="submit" label="Login" isLoading={isLoading} />

          {status && <div className="text-red-500 text-sm mt-2">{status}</div>}
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-gray-500 hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="mt-1 text-center">
          <a href="/signup" className="text-blue-500 hover:underline">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
