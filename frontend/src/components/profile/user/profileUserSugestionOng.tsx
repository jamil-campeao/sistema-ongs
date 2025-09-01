"use client";
import Link from "next/link"
import { useEffect, useState } from "react"
import { noProfileImageONG } from "app/images";
import type { Ong } from "@/interfaces/index"

export default function ProfileUserSugestionOng() {
    const [ongs, setOngs] = useState<Ong[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        async function loadOngs() {
            setIsLoading(true);
            const response = await fetch('/api/ongs', {
                method: 'GET'
            });
            const fetchedOngs = await response.json();
            setOngs(fetchedOngs || []);
            setIsLoading(false);
        }
        loadOngs();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-4">Carregando ONG's...</h3>
            </div>
        );
    }

return (
    <div className="bg-white rounded-lg shadow">
    <div className="p-4">
    <h3 className="text-base font-medium mb-4">Sugestões de ONGs</h3>
        <div className="space-y-4">
            {ongs
                .sort((a, b) => b.id - a.id) // Ordena as ONGs em ordem decrescente pelo ID
                .slice(0, 5) // Pega apenas as 5 primeiras ONGs
                .map((ong, index) => ( 
                <div key={index} className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                    <img
                        src={ong.profileImage || noProfileImageONG}
                        alt={ong.nameONG}
                        className="h-full w-full object-cover"
                    />
                    </div>
                    <div>
                    <h4 className="font-medium text-sm">{ong.nameONG}</h4>
                    <p className="text-xs text-gray-500">{ong.area}</p>
                    <Link href={`/ongs/${ong.id}`} className="w-full border border-gray-300 rounded py-1 px-3 hover:bg-gray-50">
                        <button className="text-sm">
                        Visualizar ONG
                        </button>
                    </Link>
                    </div>
                </div>
                ))}
        </div>
    </div>
</div>
)


}
