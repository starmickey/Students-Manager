import { NextRequest, NextResponse } from "next/server";
import { axiosInstance } from "../../axios";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Axios automatically JSON stringifies `data` and sets Content-Type
    const { data } = await axiosInstance.put("/translate/update", body);

    return NextResponse.json({ success: true, data }, { status: 204 });

  } catch (err: any) {
    const { message, error, status } = err;
    return NextResponse.json({ message, error }, { status });
  }
}
