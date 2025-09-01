import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function GET(request: NextRequest) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        if (!status) {
            return NextResponse.json({ error: 'Parâmetro "status" ausente na query.' }, { status: 400 });
        }

        const response = await fetch(`${API_URL}/ongs/invites?status=${status}`, {
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
