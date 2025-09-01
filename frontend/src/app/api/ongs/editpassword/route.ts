import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function PUT(request: NextRequest) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const { email, password } = await request.json();
        const response = await fetch(API_URL + "/ongs/editpassword", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            return NextResponse.json({ error: await response.json() }, { status: response.status });
        }

        return NextResponse.json(await response.json(), { status: response.status });
    } catch (error) {
        throw error;
    }
}