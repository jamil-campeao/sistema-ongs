import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

interface ProxyOptions {
  endpoint: string;
  method?: string;
  requiresAuth?: boolean;
}

export async function proxyRequest(request: NextRequest, { endpoint, method = "POST", requiresAuth = false }: ProxyOptions) {
  try {
    const data = await request.json();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (requiresAuth) {
      const token = request.cookies.get('token')?.value;
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }
    }

    const response = await fetch(API_URL + endpoint, {
      method,
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
        // Tenta fazer o parse do erro, se falhar retorna um erro genérico
        try {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData }, { status: response.status });
        } catch {
             return NextResponse.json({ error: "Unknown error from backend" }, { status: response.status });
        }
    }

    return NextResponse.json(await response.json(), { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
