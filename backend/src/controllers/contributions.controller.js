import express from "express";
import prisma from "../db/client.js";

export const getContributionsUser = async (req, res) => {
    try {
        const { id } = req.user;
        const contributions = await prisma.contribution.findMany({
            where: { userId: parseInt(id)}
        });

        if (!contributions) {
            return res.statu(404).json({ error: "Contribuições não encontradas"});
        }

        res.status(200).json(contributions);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar contribuições do usuário" });
        console.log(error);
    }
};

export const getContributions = async (req, res) => {
    try {
        const contributions = await prisma.contribution.findMany();

        if (!contributions) {
            return res.statu(404).json({ error: "Contribuições não encontradas"});
        }

        res.status(200).json(contributions);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar contribuições do usuário" });
        console.log(error);
    }
};

export const postContributionUser =  async (req, res) => {
    const {id} = req.user;
    const { name, date, type, description, hours, location, ongId, ongName } = req.body;

    if (!name || !date || !type || !description || !hours || !location || !ongName) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios"});
    }

    try {

        const data = {
            name,
            type,
            date: new Date(date),
            description,
            hours: parseInt(hours),
            location,
            userId: parseInt(id),
            ongName,
        };

        if (ongId) {
            data.ongId = parseInt(ongId);
        }

        const newContribution = await prisma.contribution.create({ data });
        const { createdAt, ...contributionWithoutTimestamps } = newContribution;
        res.status(201).json(contributionWithoutTimestamps);
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar contribuição de usuário" });
    }
};

export const putContributionByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, type, description, hours, location, ongId, ongName, feedback, rating } = req.body;
        const { id: userId } = req.user; 

        const contribution = await prisma.contribution.findUnique({ where: { id: parseInt(id)}});

        if (!contribution) {
            return res.status(404).json({ error: "Contribuição não encontrada"});
        }

        const data = {
            name,
            type,
            date: new Date(date),
            description,
            hours: parseInt(hours),
            location,
            userId: parseInt(userId),
            ongName,
        };

        if (ongId) {
            data.ongId = parseInt(ongId);
        }

        if (feedback) {
            data.feedback = feedback;
        }

        if (rating) {
            data.rating = parseInt(rating);
        }

        const updatedContribution = await prisma.contribution.update({
            where: { id: parseInt(id) },
            data
        });

        const { createdAt, ...contributionWithoutTimestamps } = updatedContribution;

        res.status(200).json(contributionWithoutTimestamps);

    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a contribuição do usuário" });
        console.log(error);
    }
};

export const deleteContributionByID =  async (req, res) => {
    try {
        const { id } = req.params;
        const contribution = await prisma.contribution.findUnique({ where: { id: parseInt(id) } });

        if (!contribution) {
            return res.status(404).json({ error: "Contribuição não encontrada" });
        }

        await prisma.contribution.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: "Contribuição deletada com sucesso"});

    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar contribuição" });
    }
};

