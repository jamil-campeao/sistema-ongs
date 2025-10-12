import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/api/config";

export async function POST(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const TOKEN = request.cookies.get("token")?.value;
    const params = context.params;
    const { id } = params;
    const response = await fetch(API_URL + "/posts/" + id + "/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: await response.json() },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json(), {
      status: response.status,
    });
  } catch (error) {
    throw error;
  }
}
