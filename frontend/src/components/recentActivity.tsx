"use client";

import { useEffect, useState } from "react"

export default function RecentActivity() {
    const [activities, setActivities] = useState([]);
    
    async function loadActivities() {
        const response = await fetch('/api/activities', {
            method: 'GET'
        });
        const activitiesData = await response.json();
        const sortedActivities = (activitiesData || []).sort((a: Activitie, b: Activitie) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setActivities(sortedActivities || []);
    }

    useEffect(() => {
        loadActivities();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            loadActivities();
        }, 60000); // 60.000 ms = 60s

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow">
        <div className="p-4">
        <h3 className="text-base font-medium mb-4">Atividades Recentes</h3>
            {activities
                .sort((a, b) => b.id - a.id) // Ordena as atividades em ordem decrescente pelo ID
                .slice(0, 5) // Pega apenas as 5 primeiras atividades
                .map((activity, i) => (
                <div key={i} className="mb-4">
                    <ul className="space-y-3">
                    <li className="flex gap-2">
                        <span className="text-gray-500">•</span>
                        <span className="font-medium text-sm">{activity?.description}</span>
                    </li>
                    </ul>
                </div>
                ))}
            </div>
        </div>
        </div>
    )
}
