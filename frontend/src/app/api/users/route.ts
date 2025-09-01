import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function POST(request: NextRequest) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const { name, email, password, location, role, description } = await request.json();
        const response = await fetch(API_URL + "/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
            body: JSON.stringify({ name, email, password, location, role, description })
        });

        if (!response.ok) {
            return NextResponse.json({ error: await response.json() }, { status: response.status });
        }

        return NextResponse.json(await response.json(), { status: response.status });
    } catch (error) {
        throw error;
    }
}

export async function PUT(request: NextRequest) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const data = await request.json();
        const response = await fetch(API_URL + "/users", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
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
