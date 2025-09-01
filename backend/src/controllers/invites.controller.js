import prisma from "../db/client.js";

export const getInviteDetails = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "ID do convite não fornecido." });
    }

    try {
        const parsedInviteId = parseInt(id);

        const invite = await prisma.associateUserONG.findUnique({
            where: { id: parsedInviteId },
            include: {
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        emailONG: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        if (!invite) {
            return res.status(404).json({ message: "Convite não encontrado." });
        }

        if (invite.status !== 'INVITE_PENDING_ONG_TO_USER') {
            return res.status(409).json({ message: "Este convite já foi respondido." });
        }

        res.status(200).json(invite);
    } catch (error) {
        console.error("Erro ao buscar detalhes do convite:", error);
        res.status(500).json({ error: "Erro interno ao buscar detalhes do convite." });
    }
};

export const putRespondToInvite = async (req, res) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body; // status: 'ACCEPTED' ou 'REJECTED_BY_USER'
    const { id: userIdLogado } = req.user;

    if (!id || !status) {
        return res.status(400).json({ message: "ID do convite ou status da resposta não fornecidos." });
    }
    // Valide se o status é um valor válido do seu enum AssociateStatus
    const validStatuses = ['ACCEPTED', 'REJECTED_BY_USER'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Status de resposta inválido." });
    }

    try {
        const parsedInviteId = parseInt(id);

        const invite = await prisma.associateUserONG.findUnique({
            where: { id: parsedInviteId },
            include: {
                user: { select: { id: true, name: true, email: true, ongId: true } },
                ong: { select: { id: true, nameONG: true, emailONG: true } }
            }
        });

        if (!invite) {
            return res.status(404).json({ message: "Convite não encontrado." });
        }
        // Validação de segurança: Garante que o usuário logado é o destinatário do convite
        if (invite.userId !== userIdLogado) {
             return res.status(403).json({ message: "Você não tem permissão para responder a este convite." });
        }

        if (invite.status !== 'INVITE_PENDING_ONG_TO_USER') {
            return res.status(409).json({ message: "Este convite já foi respondido." });
        }

        // Atualiza o status do convite
        const updatedInvite = await prisma.associateUserONG.update({
            where: { id: parsedInviteId },
            data: {
                status: status,
                rejectionReason: status === 'REJECTED_BY_USER' ? rejectionReason : null,
            }
        });

        // 4. Lógica para Aceitar Convite (Atualiza ongId no User e envia email de boas-vindas)
        if (status === 'ACCEPTED') {
            // Verificar se o usuário já tem uma ONG associada
            if (invite.user.ongId) {
                // Se sim, pode ser um erro ou uma regra de negócio de "reconvite"
                // Para este fluxo, vamos eu retorno um erro, pois ele deveria ser null
                return res.status(409).json({ message: "Usuário já está associado a outra ONG. Não é possível aceitar este convite." });
            }

            // Atualiza o campo ongId no model User
            await prisma.users.update({
                where: { id: invite.userId },
                data: { ongId: invite.ongId }
            });

            res.status(200).json({ message: "Convite aceito com sucesso! Bem-vindo(a)!" });

        } else if (status === 'REJECTED_BY_USER') {
            res.status(200).json({ message: "Convite rejeitado com sucesso." });
        }

    } catch (error) {
        console.error("Erro ao responder ao convite:", error);
        res.status(500).json({ message: "Erro interno ao responder ao convite." });
    }
};