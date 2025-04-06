import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    const { id, name, contact, address, designation, department, salary, dateOfJoining, terminationDate, documentUrl } = data;

    const updatedSalary = parseFloat(salary);
    if (id) {
      // If an ID is provided, it's an update
      const updatedStaff = await prisma.staff.update({
        where: { id },
        data: {
          name,
          contact,
          address,
          designation,
          department,
          salary:updatedSalary,
          dateOfJoining: new Date(dateOfJoining),
          terminationDate: terminationDate ? new Date(terminationDate) : null,
          documentUrl,
        },
      });

      return NextResponse.json({ message: "Staff member updated", staff: updatedStaff });
    } else {
      // If no ID is provided, it's a create
      const createdStaff = await prisma.staff.create({
        data: {
          name,
          contact,
          address,
          designation,
          department,
          salary:updatedSalary,
          dateOfJoining: new Date(dateOfJoining),
          terminationDate: terminationDate ? new Date(terminationDate) : null,
          documentUrl,
        },
      });

      return NextResponse.json({ message: "Staff member created", staff: createdStaff });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = req.query;

    if (!id) {
      return NextResponse.json({ error: "Staff ID is required" }, { status: 400 });
    }

    const deletedStaff = await prisma.staff.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Staff member deleted", deletedStaff });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const staff = await prisma.staff.findMany();
    return NextResponse.json({ staff });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


