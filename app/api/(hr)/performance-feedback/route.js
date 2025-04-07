import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // required for ObjectId validation

const prisma = new PrismaClient();

export async function GET() {
  try {
    const feedbacks = await prisma.performanceFeedback.findMany({
      include: { employee: true },
    });
    return NextResponse.json({ feedbacks });
  } catch (e) {
    console.error("Error fetching performance feedbacks:", e);
    return NextResponse.json(
      { error: e.message || "An error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    const {
      id,
      employeeId,
      workEfficiencyScore,
      targetCompletionRate,
      attendancePunctuality,
      feedbackRatings,
      description,
      lastAppraisalInfo,
      performanceScore,
      managerFeedback,
    } = data;

    // Validate employeeId is a valid MongoDB ObjectId
    if (!ObjectId.isValid(employeeId)) {
      return NextResponse.json(
        { error: "Invalid employee ID format. Must be a valid MongoDB ObjectId." },
        { status: 400 }
      );
    }

    const payload = {
      employeeId,
      workEfficiencyScore: parseInt(workEfficiencyScore),
      targetCompletionRate: parseInt(targetCompletionRate),
      attendancePunctuality: parseInt(attendancePunctuality),
      feedbackRatings,
      description,
      lastAppraisalInfo,
      performanceScore: parseFloat(performanceScore),
      managerFeedback,
    };

    let result;
    if (id) {
      result = await prisma.performanceFeedback.update({
        where: { id },
        data: payload,
      });
      return NextResponse.json({ message: "Updated", feedback: result });
    } else {
      result = await prisma.performanceFeedback.create({ data: payload });
      return NextResponse.json({ message: "Created", feedback: result });
    }
  } catch (e) {
    console.error("Error saving performance feedback:", e);
    return NextResponse.json(
      { error: e.message || "An error occurred" },
      { status: 500 }
    );
  }
}
