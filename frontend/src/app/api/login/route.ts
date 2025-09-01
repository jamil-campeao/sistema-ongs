import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        const response = await fetch(API_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: await response.json() }, { status: response.status });
        }
      
        const { token, role } = await response.json();

        const res = NextResponse.json({ message: role });
        res.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60
            
        });        
        return res;
    } catch (error) {
        throw error;
    }
}
