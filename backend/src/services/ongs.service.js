import prisma from "../db/client.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";

const isCnpjDuplicate = async (cnpj, currentOngId = null) => {
    if (!cnpj) return false;
    const existingOng = await prisma.ongs.findUnique({ where: { cnpj } });
    return existingOng && existingOng.id !== currentOngId;
};

export const createOng = async (data) => {
    if (await isCnpjDuplicate(data.cnpj)) {
        throw new AppError("Já existe uma ONG com este CNPJ", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const ongData = {
        ...data,
        password: hashedPassword,
        foundationDate: new Date(data.foundationDate),
    };

    const newOng = await prisma.ongs.create({ data: ongData });
    const { password, ...ongWithoutPassword } = newOng;
    return ongWithoutPassword;
};

export const updateOng = async (id, data) => {
    const ong = await prisma.ongs.findUnique({ where: { id } });
    if (!ong) {
        throw new AppError("ONG não encontrada", 404);
    }

    if (data.cnpj && await isCnpjDuplicate(data.cnpj, id)) {
        throw new AppError("Já existe uma ONG com este CNPJ", 400);
    }

    if (data.foundationDate) {
        data.foundationDate = new Date(data.foundationDate);
    }

    const updatedOng = await prisma.ongs.update({
        where: { id },
        data,
    });

    const { password, ...ongWithoutPassword } = updatedOng;
    return ongWithoutPassword;
};

export const getOngById = async (id) => {
    const ong = await prisma.ongs.findUnique({
        where: { id },
        select: {
            id: true,
            nameONG: true,
            socialName: true,
            cnpj: true,
            foundationDate: true,
            area: true,
            goals: true,
            cep: true,
            street: true,
            number: true,
            complement: true,
            city: true,
            district: true,
            state: true,
            cellphone: true,
            emailONG: true,
            socialMedia: true,
            nameLegalGuardian: true,
            description: true,
            profileImage: true,
            coverImage: true,
            projects: {
                select: {
                    name: true,
                    description: true,
                    projectImage: true,
                    complementImages: true,
                    additionalInfo: true,
                    contributionProject: true,
                    id: true
                }
            },
        }
    });

    if (!ong) {
        throw new AppError("ONG não encontrada", 404);
    }

    return ong;
};

export const getAllOngs = async () => {
    return await prisma.ongs.findMany({
        select: {
            id: true,
            nameONG: true,
            cnpj: true,
            foundationDate: true,
            area: true,
            goals: true,
            cep: true,
            street: true,
            number: true,
            complement: true,
            city: true,
            district: true,
            state: true,
            cellphone: true,
            emailONG: true,
            socialMedia: true,
            nameLegalGuardian: true,
            description: true,
            profileImage: true,
            coverImage: true,
            role: true
        }
    });
};

export const deleteOng = async (id) => {
    const ong = await prisma.ongs.findUnique({ where: { id } });
    if (!ong) {
        throw new AppError("ONG não encontrada", 404);
    }
    await prisma.ongs.delete({ where: { id } });
};

export const updatePassword = async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const ong = await prisma.ongs.update({
        where: { emailONG: email },
        data: { password: hashedPassword }
    });

    if (!ong) {
        throw new AppError("ONG não encontrada", 404);
    }
};
