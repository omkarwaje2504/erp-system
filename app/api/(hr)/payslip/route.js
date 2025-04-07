import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function PUT(req) {
    const data = await req.json(); // Get the updated data from the request body
  
    try {
      // Ensure that bonuses is a number
      const bonuses = parseFloat(data.bonuses);
      if (isNaN(bonuses)) {
        return NextResponse.json(
          { error: "Invalid bonuses value, it should be a number" },
          { status: 400 }
        );
      }
  
      // Check if the payslip already exists for the employee
      const existingPayslip = await prisma.payroll.findFirst({
        where: { employeeId: data.employeeId },
      });
  
      if (existingPayslip) {
        // If payslip exists, update it
        const updatedPayslip = await prisma.payroll.update({
          where: { id: existingPayslip.id },
          data: {
            basicSalary: data.basicSalary,
            deductions: data.deductions,
            bonuses: bonuses,  // Use parsed float value
            netSalary: data.netSalary,
            payslipStatus: data.payslipStatus,
          },
        });
  
        return NextResponse.json({
          message: "Payslip updated successfully",
          payslip: updatedPayslip,
        });
      } else {
        // If payslip does not exist, create a new one
        const newPayslip = await prisma.payroll.create({
          data: {
            employeeId: data.employeeId,
            basicSalary: data.basicSalary,
            deductions: data.deductions,
            bonuses: bonuses,  // Use parsed float value
            netSalary: data.netSalary,
            payslipStatus: data.payslipStatus,
          },
        });
  
        return NextResponse.json({
          message: "Payslip created successfully",
          payslip: newPayslip,
        });
      }
    } catch (err) {
      return NextResponse.json(
        { error: "Error processing payslip", details: err.message },
        { status: 500 }
      );
    }
  }
  

  export async function GET(req) {
    try {
      // Extract the employeeId from the URL query
      const url = new URL(req.url);
      const employeeId = url.searchParams.get("employeeId"); // Use URLSearchParams to get the query parameter
  
      let payslips;
  
      if (employeeId) {
        // Fetch payslip for a specific employee
        payslips = await prisma.payroll.findMany({
          where: { employeeId },
          include: {
            employee: true, // Include employee details in the result
          },
        });
      } else {
        // Fetch all payslips
        payslips = await prisma.payroll.findMany({
          include: {
            employee: true, // Include employee details in the result
          },
        });
      }
  
      return NextResponse.json({ payslips });
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }
  