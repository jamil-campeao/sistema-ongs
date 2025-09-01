import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function GET(request: NextRequest, context: { params: { id: number } }) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const params = await context.params;
        const { id } = params;
        const response = await fetch(API_URL + "/posts/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            }
        });
        
        if (!response.ok) {
          return NextResponse.json({ error: await response.json() }, { status: response.status });
        }

        return NextResponse.json(await response.json(), { status: response.status });
    } catch (error) {
        throw error;
    }
}

export async function DELETE(request: NextRequest, context: { params: { id: number } }) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const params = await context.params;
        const { id } = params;
        const response = await fetch(API_URL + "/posts/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            }
        });
        
        if (!response.ok) {
          return NextResponse.json({ error: await response.json() }, { status: response.status });
        }

        return new NextResponse(null, { status: response.status });
    } catch (error) {
        throw error;
    }
}
