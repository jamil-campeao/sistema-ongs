import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function GET(request: NextRequest) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const { searchParams } = new URL(request.url); 
        const queryTerm = searchParams.get('q'); 

        if (!queryTerm || queryTerm.trim() === '') {
            return NextResponse.json({ error: 'Termo de busca "q" ausente ou vazio.' }, { status: 400 });
        }

        const response = await fetch(`${API_URL}/search-results?q=${encodeURIComponent(queryTerm)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
        });

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ error: 'Erro desconhecido do servidor.' }));
            return NextResponse.json({ error: errorBody.error || 'Erro desconhecido.' }, { status: response.status });
        }

        return NextResponse.json(await response.json(), { status: response.status });
    } catch (error: any) {
        console.error("Erro na rota Next.js GET /api/search:", error);
        return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
    }
}