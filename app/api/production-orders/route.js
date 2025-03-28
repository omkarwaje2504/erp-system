import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { productId, productName, warehouse, quantity } = body;

    if (!productId || !productName || !warehouse || !quantity) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const order = await prisma.productionOrder.create({
      data: {
        productId,
        productName,
        warehouse,
        quantity: parseInt(quantity),
      },
    });

    return NextResponse.json(
      { message: "Production order created", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Production order creation failed:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
