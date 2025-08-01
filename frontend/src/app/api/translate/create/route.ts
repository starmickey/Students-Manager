import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "../../axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Axios automatically JSON stringifies `data` and sets Content-Type
    const { data } = await axiosInstance.post("/translate/create", body);

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch (err: any) {
    const { message, error, status } = err;
    return NextResponse.json({ message, error }, { status });
  }
}
