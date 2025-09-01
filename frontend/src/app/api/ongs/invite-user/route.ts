import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function POST(request: NextRequest) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const { userId } = await request.json();
        const response = await fetch(API_URL + "/ongs/invite-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
            body: JSON.stringify({ userId })
        });

        if (!response.ok) {
            return NextResponse.json({ error: await response.json() }, { status: response.status });
        }

        return NextResponse.json(await response.json(), { status: response.status });
    } catch (error) {
        throw error;
    }
}