import bcrypt from "bcryptjs";
import prisma from "../db/client.js";
import { AssociateStatus } from '@prisma/client';

export const getMe = async (req, res) => {
    try {
        if (req.user.tipo === "ONG") {
            return res.status(403).json({ error: "Você não tem permissão para acessar essa rota"});
        }

        const { password, ...userWithoutPassword } = req.user; // Remove a senha do objeto req.user
        const { id } = req.user;

        const users = await prisma.users.findUnique({
            where: { id: Number.parseInt(id) },
            select: {
                id: true,
                name: true,
                email: true,
                location: true,
                views: true,
                connections: true,
                role: true,
                description: true,
                createdAt: true,
                activity: {
                    select: {
                        description: true,
                    },
                },
                tags: {
                    select: {
                        name: true,
                    },
                },
                skills: true,
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        emailONG: true,
                        cnpj: true,
                    },
                },
                contributions: true,
                profileImage: true,
                coverImage: true,
                ongId: true,
            },
        });

        // Combina os dados de userWithoutPassword com os dados de users
        const combinedUserData = {
            ...userWithoutPassword,
            ...users,
        };

        return res.status(200).json(combinedUserData);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar usuário /me" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                location: true,
                views: true,
                connections: true,
                role: true,
                description: true,
                createdAt: true,
                activity: {
                    select: {
                        description: true
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                },
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        emailONG: true,
                        cnpj: true,
                    }
                },
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
};

export const getUserByID = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.users.findUnique({
            where: { id: Number.parseInt(id) },
            select: {
                id: true,
                name: true,
                email: true,
                location: true,
                views: true,
                connections: true,
                role: true,
                description: true,
                createdAt: true,
                activity: {
                    select: {
                        description: true
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                },
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        emailONG: true,
                        cnpj: true,
                    }
                },
                ongId: true,
            }
        });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
};

export const postUser = async (req, res) => {
    const { 
        name, 
        email, 
        password, 
        location,
        role, 
        description,
        tags,
    } = req.body;
    if (!name || !email || !password || !location || !role) {
        return res.status(400).json({ error: "Campos nome, email, senha, localização, tipo do usuário obrigatórios" });
    }
    try {
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "E-mail já cadastrado" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                location,
                role,
                description,
                tags: {
                    create: tags && tags.length > 0 ? tags : [{ name: "Sem tags" }]
                }
            }
        });
        const { password: _, updatedAt, ...userWithoutPassword } = newUser;
        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Erro ao criar usuário" });
    }
};

export const putUser = async (req, res) => {
    try {
        const { id } = req.user;
        const { name, email, password, location, role, description, industry, tags, skills, profileImage, coverImage } = req.body;
        
        const user = await prisma.users.findUnique({ where: { id: Number.parseInt(id) }});
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        const updateData = { name, email, password, location, role, description, industry};
        if (profileImage) updateData.profileImage = profileImage;
        if (coverImage) updateData.coverImage = coverImage;

        if (tags && tags.length > 0) {
            updateData.tags = {
                deleteMany: {},
                create: tags
            };
        }

        if (skills && Array.isArray(skills)) {
            updateData.skills = skills;
        }
        
        const updatedUser = await prisma.users.update({
            where: { id: Number.parseInt(id) },
            data: updateData,
        });
        const { password: _, ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
};

export const deleteUserByID = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.users.findUnique({ where: { id: Number.parseInt(id) } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        await prisma.users.delete({ where: { id: Number.parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
    }
};

export const PostEmailUser = async (req, res) => {
    try {
        const { email } = req.body;

        const emailUser = await prisma.users.findUnique({ where: { email }});

        if (!emailUser) {
            return res.status(404).json({ error: "E-mail não encontrado" });
        }

        res.status(200).json(emailUser);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar e-mail"});
    }
}

export const PutPasswordUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.update({
            where: { email },
            data: { password: hashedPassword }
        })

        if (!user) {
            return res.status(404).json( { error: "Usuário não encontrado" });
        }

        res.status(200).json( { message: "Senha atualizada com sucesso"});
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar senha"});
    }
}

export const GetUsersWithoutONGs = async (req, res) => {
    try {
        const user = await prisma.users.findMany({
            where: { role: 'COLLABORATOR', ongId: { equals: null } },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        if (!user) {
            return res.status(404).json( { error: "Nenhum colaborador encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error});

    }
}

export const getUserAcceptedProjects = async (req, res) => {
    const { id, tipo: userType } = req.user;

    // 1 - Validaçao: Apenas 'VOLUNTARY's podem ter projetos aceitos
    if (userType !== 'VOLUNTARY') {
        return res.status(403).json({ error: "Sua role não possui projetos participados." });
    }

    try {
        // Busca todos os registros UserAssociateProject para este usuário com status 'ACCEPTED'
        const acceptedProjects = await prisma.userAssociateProject.findMany({
            where: {
                userId: id,
                status: AssociateStatus.ACCEPTED,
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        ongId: true,
                        ong: {
                            select: {
                                nameONG: true,
                            }
                        }
                    }
                },
                user: false,
            }
        });

        res.status(200).json(acceptedProjects);
    } catch (error) {
        console.error("Erro ao buscar projetos aceitos do usuário:", error);
        res.status(500).json({ error: "Erro interno ao buscar projetos participados." });
    }
};
