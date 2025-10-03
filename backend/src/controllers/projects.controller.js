import express from "express";
import prisma from "../db/client.js";

export const getProjects = async (req , res) => {
    try {
        const projects = await prisma.projects.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                projectImage: true,
                additionalInfo: true,
                contributionProject: true,
                complementImages: true,
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        cellphone: true
                    }
                },
                ongId: true,

            }
        });
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar projetos" });
    }
};

export const getProjectsByID = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.projects.findUnique({
            where: { id: Number.parseInt(id) },
            select: {
                id: true,
                name: true,
                description: true,
                additionalInfo: true,
                projectImage: true,
                contributionProject: true,
                complementImages: true,
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        cellphone: true,
                        emailONG: true,
                        street: true,
                        number: true,
                        complement: true,
                        city: true,
                        district: true,
                        state: true,
                    }
                },
            }
        });
        if (!project) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar projeto" });
    }
};

export const postProject =  async (req, res) => {
    const { name, description, ongId, complementImages, additionalInfo, projectImage, contributionProject } = req.body;
    if (!name || !description || !ongId) {
        return res.status(400).json({ error: "Os campos nome, descrição e OngId são obrigatórios" });
    }

    const data = {
        name,
        description,
        ongId: Number.parseInt(ongId)
    }

    if (complementImages) data.complementImages = complementImages;
    if (additionalInfo) data.additionalInfo = additionalInfo;
    if (projectImage) data.projectImage = projectImage;
    if (contributionProject) data.contributionProject = contributionProject;

    try {
        const existingProject = await prisma.projects.findFirst({
            where: {
                name,
                ongId,
            },
        });

        if (existingProject) {
            return res.status(400).json({ error: "Já existe um projeto com este nome vinculado a esta ONG" });
        }

        const newProject = await prisma.projects.create({data});

        const { createdAt, updatedAt, ...projectsWithoutTimestamps } = newProject;
        res.status(201).json(projectsWithoutTimestamps);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar projeto" });
    }
};

export const putProjectByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, ongId, complementImages, additionalInfo, projectImage, contributionProject } = req.body;

        const project = await prisma.projects.findUnique({ where: { id: Number.parseInt(id) } });

        if (!project) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        const existingProject = await prisma.projects.findFirst({
            where: {
                name,
                ongId: ongId || project.ongId,
                NOT: { id: Number.parseInt(id) },
            },
        });

        if (existingProject) {
            return res.status(400).json({
                error: "Já existe um projeto com este nome vinculado a esta ONG. Não é possível atualizar o campo ongId.",
            });
        }

        const data = {};

        if (name) data.name = name;
        if (description) data.description = description;
        if (additionalInfo) data.additionalInfo = additionalInfo;
        if (projectImage) data.projectImage = projectImage;

        if (contributionProject && Array.isArray(contributionProject)) {
            data.contributionProject = contributionProject;
        }

        if (complementImages && Array.isArray(complementImages)) {
            data.complementImages = complementImages;
        }

        const updatedProject = await prisma.projects.update({
            where: { id: Number.parseInt(id) },
            data
        });

        const { createdAt, updatedAt, updatedImages, ...projectsWithoutTimestamps } = updatedProject;

        res.status(200).json(projectsWithoutTimestamps);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao atualizar projeto" });
    }
};

export const deleteProjectByID = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.projects.findUnique({ where: { id: Number.parseInt(id) } });

        if (!project) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }

        await prisma.projects.delete({ where: { id: Number.parseInt(id) } });

        res.status(200).json({ message: "Projeto deletado com sucesso"});
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar projeto" });
    }
};

export const postRequestVolunteer = async (req, res) => {
    const { id: userId, tipo: userType } = req.user;
    const { id: projectId } = req.params;
    const { userId: requesterUserId } = req.body;

    // 1. Validações de Segurança
    if (!userId || !projectId || !requesterUserId) {
        return res.status(400).json({ message: "Dados incompletos para a solicitação de voluntariado." });
    }
    // Garanta que o usuário logado é quem está fazendo a solicitação
    if (userId !== requesterUserId) {
        return res.status(403).json({ message: "Requisição não autorizada." });
    }
    // Verifique se é um usuário (não uma ONG)
    if (userType !== 'VOLUNTARY') {
        console.log(userType)
        return res.status(403).json({ message: "ONGs e Colaboradores não podem se voluntariar para projetos." });
    }

    try {
        const parsedProjectId = Number.parseInt(projectId); 

        // 2. Buscar o Projeto e a ONG Vinculada
        const project = await prisma.projects.findUnique({
            where: { id: parsedProjectId },
            select: {
                id: true,
                name: true,
                ongId: true,
                ong: {
                    select: { id: true, nameONG: true, emailONG: true }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ message: "Projeto não encontrado." });
        }
        if (!project.ongId || !project.ong) {
            return res.status(500).json({ message: "Projeto não vinculado a uma ONG válida." });
        }

        const validStatus = ['REQUEST_PENDING_USER_TO_ONG', 'ACCEPTED', 'REJECTED_BY_ONG'];

        // 3. Validar se o usuário já tem uma solicitação (pendente/aceita/rejeitada) para este projeto
        const existingRequest = await prisma.userAssociateProject.findFirst({
            where: {
                userId: userId,
                projectId: parsedProjectId,
                status: {
                    in: validStatus
                }
            }
        });

        if (existingRequest && existingRequest.status === "ACCEPTED") {
            return res.status(409).json({ message: "Você já é um voluntário aceito para este projeto." });
        }
        if (existingRequest && existingRequest.status === "REQUEST_PENDING_USER_TO_ONG") {
            return res.status(409).json({ message: "Sua solicitação de voluntariado para este projeto já está pendente." });
        }
        // Se existir e for REJECTED_BY_ONG, você pode permitir uma nova solicitação ou não
        if (existingRequest && existingRequest.status === "REJECTED_BY_ONG") {
            // Opção 1: Reativar a solicitação (se o frontend permitir)
            const updatedRequest = await prisma.userAssociateProject.update({
                where: { id: existingRequest.id },
                data: { status: "REQUEST_PENDING_USER_TO_ONG" }
            });
             return res.status(200).json({ message: "Sua solicitação anterior foi reativada!", requestId: updatedRequest.id });
            // Opção 2: Não permitir nova solicitação após rejeição
            // return res.status(409).json({ error: "Sua solicitação para este projeto foi rejeitada anteriormente." });
        }

        // 4. Criar a nova solicitação
        const newRequest = await prisma.userAssociateProject.create({
            data: {
                userId: userId,
                projectId: parsedProjectId,
                status: "REQUEST_PENDING_USER_TO_ONG",
            }
        });

        res.status(201).json({ message: "Solicitação de voluntariado enviada com sucesso!", requestId: newRequest.id });

    } catch (error) {
        console.error("Erro ao registrar solicitação de voluntariado:", error);
        res.status(500).json({ message: "Erro interno ao registrar solicitação de voluntariado." });
    }
};

export const getVolunteerStatus = async (req, res) => {
    const { id: projectId } = req.params;
    const { userId } = req.query;

    if (!projectId || !userId) {
        return res.status(400).json({ message: "IDs de projeto ou usuário ausentes." });
    }

    try {
        const parsedProjectId = Number.parseInt(projectId);
        const parsedUserid = Number.parseInt(userId)

        // Busca na tabela UserAssociateProject pelo registro que vincula o usuário ao projeto
        const volunteerRequest = await prisma.userAssociateProject.findFirst({
            where: {
                userId: parsedUserid,
                projectId: parsedProjectId, 
            },
            select: { 
                id: true,
                status: true,
            }
        });

        if (volunteerRequest) {
            res.status(200).json(volunteerRequest);
        } else {
            res.status(404).json({ message: "Solicitação de voluntariado não encontrada para este usuário e projeto." });
        }
    } catch (error) {
        console.error("Erro ao verificar status de voluntariado:", error);
        res.status(500).json({ message: "Erro interno ao verificar status de voluntariado." });
    }
};

export const respondToVolunteerRequest = async (req, res) => {
    const { requestId } = req.params;
    const { status, rejectionReason } = req.body;
    const { id: collaboratorId, tipo: collaboratorType } = req.user; 

    // Validações iniciais
    if (!requestId || !status) {
        return res.status(400).json({ error: "ID da solicitação ou status não fornecidos." });
    }

    // Garante que o status recebido é um dos valores válidos do enum
    const validStatuses = ['ACCEPTED', 'REJECTED_BY_ONG'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Status de resposta inválido." });
    }

    try {
        const parsedRequestId = Number.parseInt(requestId);

        // 1. Busca a solicitação de voluntariado e inclui os dados do usuário, projeto e ONG
        const request = await prisma.userAssociateProject.findUnique({
            where: { id: parsedRequestId },
            include: {
                user: { select: { id: true, name: true, email: true, ongId: true } }, // Voluntário
                project: {
                    select: {
                        id: true,
                        name: true,
                        ongId: true, // ID da ONG vinculada ao projeto
                        ong: { select: { id: true, nameONG: true, emailONG: true } } // Dados da ONG
                    }
                }
            }
        });

        const requestOngIdCollaborator = await prisma.users.findUnique({
            where: { id: collaboratorId },
            select: {
                ongId: true,
            },
        });

        // 2. Valida se a solicitação existe
        if (!request) {
            return res.status(404).json({ error: "Solicitação de voluntariado não encontrada." });
        }

        // 3. Validação de Autorização: Apenas um colaborador da ONG VINCULADA ao projeto pode responder
        if (collaboratorType !== 'COLLABORATOR' || requestOngIdCollaborator.ongId !== request.project.ongId) {
            return res.status(403).json({ error: "Você não tem permissão para responder a esta solicitação de voluntariado." });
        }

        // 4. Valida se a solicitação ainda está pendente (para evitar aceitar/rejeitar duas vezes)
        if (request.status !== "REQUEST_PENDING_USER_TO_ONG") {
            return res.status(409).json({ error: "Esta solicitação já foi respondida." });
        }

        // 5. Atualiza o status da solicitação no banco de dados
        const updatedRequest = await prisma.userAssociateProject.update({
            where: { id: parsedRequestId },
            data: {
                status: status,
                // O motivo da rejeição é armazenado apenas se o status for REJEITADO
                rejectionReason: status === "REJECTED_BY_ONG" ? rejectionReason : null,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                project: {
                    select: {
                        name: true,
                    }
                },
            }
        });

        // 6. Lógica de Envio de E-mails de Notificação
        if (status === "ACCEPTED") {
            res.status(200).json({ message: "Solicitação aceita com sucesso!", updatedRequest });

        } else if (status === "REJECTED_BY_ONG") {
            res.status(200).json({ message: "Solicitação rejeitada com sucesso.", updatedRequest });
        }

    } catch (error) {
        console.error("Erro ao responder solicitação de voluntariado:", error);
        res.status(500).json({ error: "Erro interno ao responder solicitação de voluntariado." });
    }
};

