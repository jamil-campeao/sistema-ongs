import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const response = await fetch(API_URL + "/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          return NextResponse.json({ error: await response.json() }, { status: response.status });
        }

        return NextResponse.json(await response.json(), { status: response.status });
    } catch (error) {
        throw error;
    }
}
