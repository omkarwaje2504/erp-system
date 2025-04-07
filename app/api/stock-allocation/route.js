import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET method to fetch stock allocations
export async function GET() {
  try {
    const allocations = await prisma.stockAllocation.findMany({
      include: { product: true },  // Fetch the associated product data as well
    });
    return NextResponse.json({ allocations });
  } catch (error) {
    console.error("Error fetching stock allocations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST method to create a new stock allocation
export async function POST(req) {
  try {
    const data = await req.json();
    console.log("Received data:", data); // Check if the date is in correct format
    
    const { date, batchNo, production, materials, status, description, productId } = data;

    // Additional validation if needed
    if (!date || !batchNo || !productId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const createdAllocation = await prisma.stockAllocation.create({
      data: {
        date: new Date(date),  // Ensure date is handled as a DateTime object
        batchNo,
        production,
        materials,
        status,
        description,
        productId,
      },
    });

    return NextResponse.json({ message: "Stock allocation created", allocation: createdAllocation });
  } catch (error) {
    console.error("Error creating stock allocation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

