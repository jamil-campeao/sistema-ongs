import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function GET(request: NextRequest,  context: { params: { id: number } }) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const params = await context.params;
        const { id } = params;

        
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Parâmetro "userId" ausente na query string.' }, { status: 400 });
        }

        const response = await fetch(`${API_URL}/projects/${id}/volunteer-status?userId=${userId}`, {
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