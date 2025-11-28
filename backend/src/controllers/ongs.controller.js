import * as ongService from "../services/ongs.service.js";
import { createOngSchema, updateOngSchema } from "../schemas/ongs.schema.js";
import AppError from "../utils/AppError.js";

export const getMe = async (req, res, next) => {
    try {
        if (req.user.tipo !== "ONG") {
            throw new AppError("Você não tem permissão para acessar essa rota", 403);
        }
        const { id } = req.user;
        const ong = await ongService.getOngById(Number.parseInt(id));
        res.status(200).json(ong);
    } catch (error) {
        next(error);
    }
};

export const getOngs = async (req, res, next) => {
    try {
        const ongs = await ongService.getAllOngs();
        res.status(200).json(ongs);
    } catch (error) {
        next(error);
    }
};

export const getOngProjects = async (req, res, next) => {
    try {
        const { id } = req.user;
        const projectsOng = await import("../db/client.js").then(m => m.default.projects.findMany({
            where: {ongId: Number.parseInt(id)}
        }));
        res.status(200).json(projectsOng);

    } catch (error) {
        next(error);
    }
}

export const getOngByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ong = await ongService.getOngById(Number.parseInt(id));
        res.status(200).json(ong);
    } catch (error) {
        next(error);
    }
};

export const postOng = async (req, res, next) => {
    try {
        const validation = createOngSchema.safeParse(req.body);
        if (!validation.success) {
            if (validation.error && validation.error.errors && validation.error.errors.length > 0) {
                throw new AppError(validation.error.errors[0].message, 400);
            } else {
                 throw new AppError("Erro de validação", 400);
            }
        }
        const ongExists = await ongService.getOngByCnpj(req.body.cnpj);
        if (ongExists) {
            throw new AppError("ONG já cadastrada", 400);
        }

        const newOng = await ongService.createOng(req.body);
        return res.status(201).json(newOng);
    } catch (error) {
        next(error);
    }
};

export const putOng = async (req, res, next) => {
    try {
        if (req.user.tipo !== "ONG") {
            throw new AppError("Você não tem permissão para acessar essa rota", 403);
        }

        const { id } = req.user;
        const validation = updateOngSchema.safeParse(req.body);
        if (!validation.success) {
            if (validation.error && validation.error.errors && validation.error.errors.length > 0) {
                throw new AppError(validation.error.errors[0].message, 400);
            } else {
                 throw new AppError("Erro de validação", 400);
            }
        }

        const updatedOng = await ongService.updateOng(Number.parseInt(id), req.body);
        res.status(200).json(updatedOng);
    } catch (error) {
        next(error);
    }
};

export const deleteOngByID = async (req, res, next) => {
    try {
        if (req.user.tipo !== "ONG") {
            throw new AppError("Você não tem permissão para acessar essa rota", 403);
        }
        const { id } = req.params;
        await ongService.deleteOng(Number.parseInt(id));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getCNPJ = async (req, res, next) => {
    try {
        const { cnpj } = req.params;
        const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        next(new AppError(`Erro ao consultar dados de CNPJ: ${error.message}`, 500));
    }
};

export const PutPasswordOng = async (req, res, next) => {
    try {
        if (req.user.tipo !== "ONG") {
            throw new AppError("Você não tem permissão para acessar essa rota", 403);
        }
        const { email, password } = req.body;
        await ongService.updatePassword(email, password);
        res.status(200).json({ message: "Senha atualizada com sucesso" });
    } catch (error) {
        next(error);
    }
};

export const PostInviteUserToONG = async (req, res, next) => {
    try {
        const { id: ongId, tipo: ongLogadaTipo } = req.user;
        const { userId } = req.body;

        if (ongLogadaTipo !== "ONG") {
            throw new AppError("Apenas ONG pode acessar esse recurso.", 403);
        }
        if (!userId) {
            throw new AppError("ID do usuário a ser convidado não informado.", 400);
        }

        const prisma = (await import("../db/client.js")).default;

        const targetUser = await prisma.users.findUnique({
            where: { id: userId },
            select: { id: true, ongId: true, role: true }
        });

        if (!targetUser) {
            throw new AppError("Usuário convidado não encontrado.", 404);
        }
        if (targetUser.ongId) {
            throw new AppError("Usuário já está associado a outra ONG.", 409);
        }
        if (targetUser.role !== 'COLLABORATOR') {
             throw new AppError("Apenas usuários colaboradores podem ser convidados.", 403);
        }

        const existingInvite = await prisma.associateUserONG.findFirst({
            where: {
                userId: userId,
                ongId: ongId,
                status: { in: ['INVITE_PENDING_ONG_TO_USER', 'ACCEPTED'] }
            }
        });

        if (existingInvite && existingInvite.status === 'ACCEPTED') {
            throw new AppError("Este usuário já é um colaborador desta ONG.", 409);
        }
        if (existingInvite && existingInvite.status === 'INVITE_PENDING_ONG_TO_USER') {
            throw new AppError("Um convite de uma ONG já foi encaminhada para esta usuário e está pendente.", 409);
        }

        const newInvite = await prisma.associateUserONG.create({
            data: {
                userId: userId,
                ongId: ongId,
                status: 'INVITE_PENDING_ONG_TO_USER'
            },
            include: {
                user: { select: { id: true, name: true, email: true } }
            },
        });

        res.status(201).json({ message: "Convite enviado e registrado com sucesso!", inviteId: newInvite.id });

    } catch (error) {
        next(error);
    }
};

export const getAllOngUserRelations = async (req, res, next) => {
    try {
        const {id, tipo: ongLogadaTipo } = req.user;

        if (ongLogadaTipo !== "ONG") {
            throw new AppError("Acesso negado: Você não tem permissão para ver estas relações.", 403);
        }

        const prisma = (await import("../db/client.js")).default;
        const relations = await prisma.associateUserONG.findMany({
            where: { ongId: id },
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        });
        res.status(200).json(relations);
    } catch (error) {
        next(error);
    }
};

export const getProjectVolunteerRequestsForOng = async (req, res, next) => {
    try {
        const { id: ongId } = req.params;
        const parsedOngId = Number.parseInt(ongId);
        
        const prisma = (await import("../db/client.js")).default;

        const projectsOfOng = await prisma.projects.findMany({
            where: {  ongId: parsedOngId },
            select: { id: true }
        });

        const projectIds = projectsOfOng.map(p => p.id);

        if (projectIds.length === 0) {
            return res.status(200).json([]);
        }

        const requests = await prisma.userAssociateProject.findMany({
            where: {
                projectId: { in: projectIds }
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                project: { select: { id: true, name: true } }
            }
        });

        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};