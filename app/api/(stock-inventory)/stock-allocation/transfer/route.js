// /pages/api/stock-allocation/transfer.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const data = await req.json();
  
  const { productId, warehouseFrom, warehouseTo, quantity, description } = data;

  try {
    // Fetch the current product and validate the transfer
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Adjust available stock based on the transfer
    const updatedProductFrom = await prisma.product.update({
      where: { id: productId },
      data: { availableStock: product.availableStock - quantity },
    });

    // Create the product entry in the new warehouse
    const updatedProductTo = await prisma.product.create({
      data: {
        ...updatedProductFrom,
        warehouseId: warehouseTo,
        availableStock: quantity,
      },
    });

    return NextResponse.json({
      message: "Stock transferred successfully",
      updatedProductFrom,
      updatedProductTo,
    });
  } catch (error) {
    console.error("Error transferring stock:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
