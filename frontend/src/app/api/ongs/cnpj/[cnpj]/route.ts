import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/api/config";

export async function GET(
  request: NextRequest,
  context: { params: { cnpj: string } }
) {
  try {
    const params = context.params;
    const { cnpj } = params;
    const response = await fetch(API_URL + "/ongs/cnpj/" + cnpj, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
