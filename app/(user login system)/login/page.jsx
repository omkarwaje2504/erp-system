"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import Card from "@/components/Card";

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
    if (status) {
      const timer = setTimeout(() => {
        setStatus("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userData", JSON.stringify(data.user));
        router.push(`/dashboard`);
      } else {
        setStatus(data.error);
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-xl">
        <div className="text-center mb-8 w-full">
          <img
            src="/erp-banner-login.jpg"
            alt="ERP System"
            className="mx-auto w-full mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {status && (
            <div className="text-sm text-red-600 text-center">{status}</div>
          )}

          <Button
            type="submit"
            label={isLoading ? "Signing in..." : "Sign in"}
            isLoading={isLoading}
            className="w-full"
          />
        </form>

        <div className="mt-6 text-center space-y-2">
          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Forgot your password?
          </a>
          <div className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
