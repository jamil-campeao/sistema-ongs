import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { cep } = await request.json();
        const response = await fetch("https://viacep.com.br/ws/" + cep + "/json/")

        if (!response.ok) {
            return NextResponse.json({ error: await response.json() }, { status: response.status });
        }

        return NextResponse.json(await response.json(), { status: response.status });
    } catch (error) {
        throw error;
    }
}
