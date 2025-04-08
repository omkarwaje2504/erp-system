import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST method to handle both create and update
export async function POST(req) {
  try {
    const data = await req.json();
    const { id, date, supplier, item, quantity, status, description, type,issue } =
      data;

    // Validate input fields
    if (!date || !supplier || !item || !quantity || !status || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Handle PurchaseRequestOrder or ReturnHandlingDefectiveMaterial based on 'type'
    let result;
    let updateQuantity = parseInt(quantity);
    if (type === "purchaseRequestOrder") {
      if (id) {
        // Update the existing PurchaseRequestOrder
        result = await prisma.purchaseRequestOrder.update({
          where: { id },
          data: {
            date,
            supplier,
            item,
            quantity: updateQuantity,
            status,
            description,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create a new PurchaseRequestOrder
        result = await prisma.purchaseRequestOrder.create({
          data: {
            date,
            supplier,
            item,
            quantity: updateQuantity,
            status,
            description,
          },
        });
      }
    } else if (type === "returnHandlingDefectiveMaterial") {
      if (id) {
        // Update the existing ReturnHandlingDefectiveMaterial
        result = await prisma.returnHandlingDefectiveMaterial.update({
          where: { id },
          data: {
            date,
            item,
            supplier,
            issue,
            status,
            description,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create a new ReturnHandlingDefectiveMaterial
        result = await prisma.returnHandlingDefectiveMaterial.create({
          data: {
            date,
            item,
            supplier,
            issue,
            status,
            description,
          },
        });
      }
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error creating or updating record:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}

// GET method to fetch all records
export async function GET(req) {
  try {
    // Parse the URL to get query params
    const url = new URL(req.url);
    const type = url.searchParams.get("type");

    if (type === "purchaseRequestOrder") {
      const purchaseRequests = await prisma.purchaseRequestOrder.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(purchaseRequests, { status: 200 });
    } else if (type === "returnHandlingDefectiveMaterial") {
      const returnRequests =
        await prisma.returnHandlingDefectiveMaterial.findMany({
          orderBy: { createdAt: "desc" },
        });
      return NextResponse.json(returnRequests, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
