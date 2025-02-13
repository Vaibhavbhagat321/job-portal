import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userMail = url.searchParams.get("userMail");

  if (!userMail)
    return new Response(
      JSON.stringify({ message: "Bad Request!", status: 400 })
    );

  const applications = await prisma.application.findMany({
    where: {
      mail: userMail,
    },
    include: {
      job: true,
    },
  });

  return new Response(JSON.stringify({ applications, status: 200 }));
}

export async function POST(req: NextRequest) {
  const { name, resume, mail, id: jobId } = await req.json();

  try {
    const res = await prisma.application.create({
      data: {
        name,
        mail,
        jobId,
        resume,
      },
    });
    return NextResponse.json({
      message: "Application Submited Succesfully!",
      application: res,
      status: 201,
    });
  } catch (err) {
    return NextResponse.json({ error: err, status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { id, status } = await req.json();

  try {
    const res = await prisma.application.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({
      message: "Status Updated Succesfully!",
      application: res,
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ error: err, status: 500 });
  }
}
