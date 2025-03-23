"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
  
      router.push("/login");
  
  }, []);

  return <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
  {/* Navigation */}
  <nav className="absolute top-0 w-full p-4 flex justify-center bg-white shadow-sm">
    <h1 className="text-lg font-semibold">Home</h1>
  </nav>

  {/* Login Card */}
  <div className="bg-white p-8 rounded-lg shadow-md w-96">
    <div className="flex justify-center">
      <div className="bg-black text-white p-3 rounded-lg text-xl font-bold">
        E
      </div>
    </div>
    <h2 className="text-center text-lg font-semibold mt-4">Login to Frappe</h2>

    {/* Form */}
    <form className="mt-6">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-1">Email</label>
        <input
          type="email"
          placeholder="jane@example.com"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-gray-200"
        />
        <a href="#" className="text-sm text-gray-500 hover:underline float-right mt-1">
          Forgot Password?
        </a>
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 transition"
      >
        Login
      </button>
    </form>

    {/* Alternative Login */}
    <div className="mt-4 text-center text-gray-500 text-sm">or</div>
    <button className="w-full mt-2 bg-gray-200 p-2 rounded-md text-gray-700 hover:bg-gray-300 transition">
      Login with Email Link
    </button>
  </div>
</div>;
}
