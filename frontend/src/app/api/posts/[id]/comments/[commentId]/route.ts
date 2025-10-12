import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/api/config";

export async function PUT(
  request: NextRequest,
  context: { params: { id: number; commentId: number } }
) {
  try {
    const TOKEN = request.cookies.get("token")?.value;
    const params = context.params;
    const { id, commentId } = params;
    const data = await request.json();
    const response = await fetch(
      API_URL + "/posts/" + id + "/comments/" + commentId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + TOKEN,
        },
        body: JSON.stringify(data),
      }
    );

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

export async function DELETE(
  request: NextRequest,
  context: { params: { id: number; commentId: number } }
) {
  try {
    const TOKEN = request.cookies.get("token")?.value;
    const params = context.params;
    const { id, commentId } = params;
    const response = await fetch(
      API_URL + "/posts/" + id + "/comments/" + commentId,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + TOKEN,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: await response.json() },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: response.status });
  } catch (error) {
    throw error;
  }
}
