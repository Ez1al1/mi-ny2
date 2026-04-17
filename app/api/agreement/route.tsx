import { NextResponse } from "next/server";

function generateReferenceId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = (length: number) =>
    Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `AGR-${part(5)}-${part(4)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const record = {
      ...body,
      agreementVersion: "v1.0",
      timestamp: new Date().toISOString(),
      referenceId: generateReferenceId(),
    };

    console.log("New Agreement Submission:", record);

    return NextResponse.json({
      success: true,
      referenceId: record.referenceId,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
