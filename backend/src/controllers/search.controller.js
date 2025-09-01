import express from "express";
import prisma from "../db/client.js";

export const searchOngsAndProjects = async (req, res) => {
    const { q: searchTerm } = req.query; // Pega o termo de busca 'q' da query string

    if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ error: "Termo de busca vazio." });
    }

    const searchPattern = `%${searchTerm.trim()}%`; // Padrão para busca "LIKE" no SQL (case-insensitive)

    try {
        // 1. Buscar ONGs
        const ongs = await prisma.ongs.findMany({
            where: {
                OR: [
                    { nameONG: { contains: searchTerm, mode: 'insensitive' } }, // Busca no nome da ONG
                    { description: { contains: searchTerm, mode: 'insensitive' } }, // Busca na descrição da ONG
                ],
            },
            select: {
                id: true,
                nameONG: true,
                description: true,
                profileImage: true,
            },
            // take: 10, // Limita o número de resultados
        });

        // 2. Buscar Projetos
        const projects = await prisma.projects.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } }, // Busca no nome do projeto
                    { description: { contains: searchTerm, mode: 'insensitive' } }, // Busca na descrição do projeto
                ],
            },
            select: {
                id: true,
                name: true,
                description: true,
                projectImage: true,
                ong: {
                    select: {
                        nameONG: true,
                    },
                },

            },
            // take: 10, // Limita o número de resultados
        });

        res.status(200).json({ ongs, projects });

    } catch (error) {
        console.error("Erro na busca de ONGs e Projetos:", error);
        res.status(500).json({ error: "Erro interno ao realizar a busca." });
    }
};