import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/api/config";

export async function PUT(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const TOKEN = request.cookies.get("token")?.value;
    const params = context.params;
    const { id } = params;
    const data = await request.json();
    const response = await fetch(API_URL + "/contributions/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN,
      },
      body: JSON.stringify(data),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseBody },
        { status: response.status }
      );
    }

    return NextResponse.json(responseBody, {
      status: response.status,
    });
  } catch (error) {
    throw error;
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: number } }
) {
  try {
    const TOKEN = request.cookies.get("token")?.value;
    const params = context.params;
    const { id } = params;
    const response = await fetch(API_URL + "/contributions/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + TOKEN,
      },
    });

    const responseBody = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseBody },
        { status: response.status }
      );
    }

    return NextResponse.json(responseBody, {
      status: response.status,
    });
  } catch (error) {
    throw error;
  }
}
