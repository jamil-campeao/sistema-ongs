import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function GET(request: NextRequest) {
    try {
        const TOKEN = request.cookies.get('token')?.value;
        const response = await fetch(API_URL + "/ongs", {
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

export async function POST(request: NextRequest) {
    const { nameONG, socialName, cnpj, foundationDate, area, goals, cep, street, number, complement, city, district, 
        state, cellphone, emailONG, socialMedia, nameLegalGuardian, cpfLegalGuardian, rgLegalGuardian, cellphoneLegalGuardian, description, password} = await request.json();
    try {
        const response = await fetch(API_URL + "/ongs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nameONG, socialName, cnpj, foundationDate, area, goals, cep, street, number, complement, city, district, 
        state, cellphone, emailONG, socialMedia, nameLegalGuardian, cpfLegalGuardian, rgLegalGuardian, cellphoneLegalGuardian, description, password })
        });
        
        if (response.status === 201) {
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
        const response = await fetch(API_URL + "/ongs", {
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
