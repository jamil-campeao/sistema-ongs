import { NextRequest } from 'next/server';
import { proxyRequest } from "@/utils/apiProxy";

export async function POST(request: NextRequest) {
    return proxyRequest(request, { 
        endpoint: "/forgot-password/send-email" 
    });
}
