import express from "express";
import prisma from "../db/client.js";

export const getFilterProjects = async (req, res) => {
    const { name, description, createdAt, updatedAt, ongID, tags } = req.query;

    try {
        const filters = {};

        if (name) filters.name = { contains: name };
        if (description) filters.description = { contains: description };
        if (createdAt) filters.createdAt = new Date(createdAt);
        if (updatedAt) filters.updatedAt = new Date(updatedAt);
        if (ongID) filters.ongID = Number.parseInt(ongID);
        if (tags) filters.tags = { hasSome: tags.split(",") };

        const projects = await prisma.projects.findMany({
            where: filters,
            select : {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                tags: true,
                ong: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                images: {
                    select: {
                        url: true
                    }
                },
                activities: {
                    select: {
                        id: true
                    }
                },
                posts: {
                    select: {
                        id: true
                    }
                }
            }
        });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Erro ao realizar filtro de projetos." });
    }
};

export const getFilterActivities = async (req, res) => {
    const { description, createdAt, userID, projectID, postID } = req.query;

    try {
        const filters = {};
        if (description) filters.description = { contains: description };
        if (createdAt) filters.createdAt = new Date(createdAt);
        if (userID) filters.userID = Number.parseInt(userID);
        if (projectID) filters.projectID = Number.parseInt(projectID);
        if (postID) filters.postID = Number.parseInt(postID);

        const activities = await prisma.activities.findMany({
            where: filters,
            select: {
                id: true,
                description: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ error: "Erro ao realizar filtro de atividades." });
    }
};

export const getFilterPosts = async (req, res) => {
    const { title, description, createdAt, updatedAt, userID, projectID } = req.query;

    try {
        const filters = {};
        if (title) filters.title = { contains: title };
        if (description) filters.description = { contains : description };
        if (createdAt) filters.createdAt = new Date(createdAt);
        if (updatedAt) filters.updatedAt = new Date(updatedAt);
        if (userID) filters.userID = Number.parseInt(userID);
        if (projectID) filters.projectID = Number.parseInt(projectID);

        const posts = await prisma.posts.findMany({
            where: filters,
            select : {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                activities: {
                    select: {
                        id: true
                    }
                }
            }
        });

        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao realizar filtro de posts."});        
    }
};

export const getFilterUsers = async (req, res) => {
    const { name, email, role, location } = req.query;

    try {
        const filters = {};

        if (name) filters.name = { contains: name };
        if (email) filters.email = { contains: email};
        if (role) filters.role = role; // Atribuo diretamente o valor, pois é um enum no Prisma
        if (location) filters.location = { contains: location };

        const users = await prisma.users.findMany({
            where: filters,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                location: true,
                images: {
                    select: {
                        url: true
                    }
                }
            }
        });

        res.status(200).json(users);
        
    } catch (error) {
        res.status(500).json( { error: "Erro ao realizar filtro de usuários."});
        
    }
};

export const getFilterOngs = async (req, res) => {
    const { name } = req.query;

    try {
        const filters = {};

        if (name) filters.name = { contains: name };

        const ongs = await prisma.ongs.findMany({
            where: filters
        });

        res.status(200).json(ongs);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao realizar filtro de ONGs."});
        console.error(error);
    }
}