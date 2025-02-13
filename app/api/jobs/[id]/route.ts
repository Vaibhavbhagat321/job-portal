import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const url = new URL(req.url);
  const userType = url.searchParams.get("userType");
  let job;

  if (userType === "company") {
    job = await prisma.job.findUnique({
      where: { id },
      include: {
        application: true,
      },
    });
  } else {
    job = await prisma.job.findUnique({
      where: { id },
    });
  }

  return NextResponse.json({ status: 200, job });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const {
    job_title: title,
    job_description: description,
    company_name: company,
    job_location: location,
  } = await req.json();

  try {
    const job = await prisma.job.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        company,
        location,
      },
    });
    return NextResponse.json({
      message: "Job Updated Successfully",
      job,
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ status: 500, error: err });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({
      message: "Job Deleted Successfully",
      job,
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ status: 500, error: err });
  }
}
