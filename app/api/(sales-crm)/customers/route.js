import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, name, contact, status, description, location, docUrl } = body;

    if (!name || !contact || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (id) {
      const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: {
          name,
          contact,
          status,
          description,
          location,
          docUrl,
        },
      });

      return NextResponse.json(
        {
          message: "Customer updated successfully",
          customer: updatedCustomer,
        },
        { status: 200 }
      );
    }

    const newCustomer = await prisma.customer.create({
      data: {
        name,
        contact,
        status,
        description,
        location,
        docUrl,
      },
    });

    return NextResponse.json(
      {
        message: "Customer created successfully",
        customer: newCustomer,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Customer save failed", details: error.message },
      { status: 500 }
    );
  }
}
