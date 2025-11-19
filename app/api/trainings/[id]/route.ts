import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Training from "@/models/Training";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Training.findByIdAndDelete(params.id);
  return new NextResponse(null, { status: 204 });
}
