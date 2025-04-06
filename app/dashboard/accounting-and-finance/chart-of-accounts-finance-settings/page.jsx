"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ERPHomePage() {
  const router = useRouter();

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountRes] = await Promise.all([
          fetch("/api/chart-of-accounts"),
        ]);

        const accountData = await accountRes.json();

        setAccounts(accountData.accounts || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const totalAccounts = accounts.length;
  const activeAccounts = accounts.filter((a) => a.status === "Active").length;

  // Handle edit
  const handleEdit = (account) => {
    localStorage.setItem("chart-of-account-data", JSON.stringify(account));
    router.push(
      "/dashboard/accounting-and-finance/chart-of-accounts-finance-settings/add"
    );
  };

  // Handle delete
  const handleDelete = async (accountId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );
    if (confirmDelete) {
      try {
        const res = await fetch(`/api/chart-of-accounts`, {
          method: "DELETE",
          body: JSON.stringify({ id: accountId }),
        });
        const data = await res.json();
        if (res.ok) {
          // Remove the deleted account from the state
          setAccounts((prev) =>
            prev.filter((account) => account.id !== accountId)
          );
        } else {
          alert(data.error || "Failed to delete account");
        }
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Chart of Accounts & Finance Settings
      </h1>

      {/* Chart of Accounts Section */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Chart of Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-100 p-4 rounded text-center">
            <p className="text-sm text-gray-500">Total Accounts Created</p>
            <p className="text-xl font-bold">{totalAccounts}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded text-center">
            <p className="text-sm text-gray-500">Active Accounts</p>
            <p className="text-xl font-bold">{activeAccounts}</p>
          </div>
        </div>

        <div className="flex justify-end mb-2">
          <button
            onClick={() =>
              router.push(
                "/dashboard/accounting-and-finance/chart-of-accounts-finance-settings/add"
              )
            }
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Create Account
          </button>
        </div>

        {/* Table */}
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Account Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Balance</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id} className="border-b">
                <td className="p-2">{acc.name}</td>
                <td className="p-2">{acc.type}</td>
                <td className="p-2">₹{acc.balance}</td>
                <td className="p-2">{acc.status}</td>
                <td className="p-2 text-blue-600">
                  <button className="mr-4" onClick={() => handleEdit(acc)}>
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(acc.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
