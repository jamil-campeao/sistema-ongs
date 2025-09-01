import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function GET(request: NextRequest) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const response = await fetch(API_URL + "/activities", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: await response.json() }, { status: response.status });
        }

        return NextResponse.json(await response.json(), { status: response.status });
    } catch (error) {
        throw error;
    }
}
