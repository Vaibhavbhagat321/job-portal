import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const user = {
    userType: url.searchParams.get("userType"),
    userMail: url.searchParams.get("userMail"),
  };

  try {
    let jobs;
    if (user.userType === "company" && user.userMail) {
      jobs = await prisma.job.findMany({
        where: {
          company_mail: user.userMail,
        },
      });
    } else {
      jobs = await prisma.job.findMany();
    }

    return NextResponse.json({
      jobs,
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ status: 500, error: err });
  }
}

export async function POST(req: NextRequest) {
  const {
    job_title: title,
    job_description: description,
    company_name: company,
    job_location: location,
    company_mail,
  } = await req.json();

  try {
    const job = await prisma.job.create({
      data: {
        title,
        description,
        company,
        company_mail,
        location,
      },
    });
    return NextResponse.json({
      message: "Job created successfully",
      job,
      status: 201,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: 500, error: err });
  }
}
