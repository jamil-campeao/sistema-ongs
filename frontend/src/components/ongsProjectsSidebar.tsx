"use client";

import Link from "next/link"
import { useEffect, useState } from "react"

export default function OngsProjectsSidebar() {
    const [ongs, setOngs] = useState([]);
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
        async function loadOngs() {
            const response = await fetch('/api/ongs', {
                method: 'GET'
            });
            const fetchedOngs = await response.json();
            setOngs(fetchedOngs || []);
        }
        loadOngs();
        async function loadProjects() {
            const response = await fetch('/api/projects', {
                method: 'GET'
            });
            const fetchedProjects = await response.json();
            setProjects(fetchedProjects || []);
        }
        loadProjects();
    }, []);

    return (
        <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 text-center">
                    <h3 className="text-base font-medium mb-2">Alguns números</h3>
                </div>
                <div className="p-0">
                    <nav className="space-y-1">
                        {[
                        { label: "ONG's", count: ongs.length },
                        { label: "Projetos", count: projects.length },
                        ].map((item, i) => (
                        <Link key={i} href="#" className="flex items-center justify-between px-4 py-2 hover:bg-gray-100">
                            <span className="text-sm">{item.label}</span>
                            <span className="text-sm text-gray-500">{item.count}</span>
                        </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
