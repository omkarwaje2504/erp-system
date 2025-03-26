"use client";
import SalesLayout from "../../components/SalesLayout";

const customers = [
  { name: "Blue Ocean Logistics", contact: "Robert Taylor", email: "robert@email.com", status: "Active", value: "$89,300", lastOrder: "2023-06-05" },
  { name: "TechNova Inc.", contact: "Sarah Johnson", email: "sarah@email.com", status: "Active", value: "$78,500", lastOrder: "2023-06-02" },
  { name: "Quantum Solutions", contact: "David Wilson", email: "david@email.com", status: "Active", value: "$56,800", lastOrder: "2023-06-10" },
];

export default function Customers() {
  return (
    <SalesLayout>
      <h2 className="text-xl font-bold mb-4">Customer Database</h2>
      <input type="text" placeholder="Search customers..." className="border rounded-md px-4 py-2 mb-4 w-full"/>

      <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Contact</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Value</th>
            <th className="p-3 text-left">Last Order</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index} className="border-b">
              <td className="p-3">{customer.name}</td>
              <td className="p-3">{customer.contact}</td>
              <td className="p-3">{customer.status}</td>
              <td className="p-3">{customer.value}</td>
              <td className="p-3">{customer.lastOrder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SalesLayout>
  );
}
