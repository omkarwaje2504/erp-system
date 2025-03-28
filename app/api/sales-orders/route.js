import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST: Create new order
export async function POST(req) {
  try {
    const body = await req.json();
    const { customerName, quantity, product, price, status, id } = body;

    if (!customerName || !quantity || !product || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    if (id) {
      const updateOrder = await prisma.salesOrder.update({
        where: { id },
        data: { customerName, quantity, product, price, status },
      });
      return NextResponse.json(
        { message: "Order updated", order: updateOrder },
        { status: 200 }
      );
    } else {
      const newOrder = await prisma.salesOrder.create({
        data: { customerName, quantity, product, price, status },
      });

      return NextResponse.json(
        { message: "Order created", order: newOrder },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Fetch all orders
export async function GET() {
  try {
    const orders = await prisma.salesOrder.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
