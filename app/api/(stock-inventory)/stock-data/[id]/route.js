// /pages/api/stock-allocation/[id].js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(req) {
  const { id } = req.query;  // get the product ID
  const data = await req.json();

  const { availableStock, status, description } = data;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        availableStock,
        status, // Pending, In Progress, Completed
        description,
      },
    });

    return NextResponse.json({ message: "Product stock updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product stock:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
