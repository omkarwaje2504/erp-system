"use client";

import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router=useRouter();
  router.push("/dashboard/sales-crm");
};

export default Dashboard;
