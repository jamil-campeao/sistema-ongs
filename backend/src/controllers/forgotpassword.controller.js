import prisma from "../db/client.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

function geraCodigo() {
  const codigo = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return codigo;
}

function discoverType(user) {
    if (user) {
        return user.role
    }
    else {
        return "ONG"
    }
}

export const sendEmail = async (req, res) => {
    const { email } = req.body;
    const MAIL_USER = process.env.MAIL_USER
    const MAIL_PASS = process.env.MAIL_PASS

    try {
        const user = await prisma.users.findUnique({ where: { email } });
        const ong = await prisma.ongs.findUnique({ where: { emailONG: email }});

        if (!user && !ong) {
            return res.status(404).json({ error: "Usuário ou ONG não encontrado" });
        }
        const role = discoverType(user)
        const codigo = geraCodigo();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS,
        },
        });

        const resetLink = `http://72.60.12.191:3001/editpassword?email=${encodeURIComponent(email)}&codigo=${encodeURIComponent(codigo)}`;

        await transporter.sendMail({
        from: '"Colabora" <noreply@colabora.com>',
        to: email,
        subject: "Recuperação de Senha - Colabora",
        html: `
            <p>Você solicitou a redefinição de senha.</p>
            <p>Clique no link abaixo para criar uma nova senha:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Este link expira em 1 hora.</p>
        `,
        });

        if (role === "ONG") {
            await prisma.userOngToken.deleteMany({
            where: { ongId: ong.id },
            });

            await prisma.userOngToken.create({
            data: {
                token: codigo,
                ongId: ong.id,
                expiresAt,
            },
            });
   
        }
        else {
            await prisma.userOngToken.deleteMany({
            where: { userId: user.id },
            });

            await prisma.userOngToken.create({
            data: {
                token: codigo,
                userId: user.id,
                expiresAt,
            },
            });
        }

        return res.status(200).json({ message: "E-mail de redefinição de senha enviado com sucesso" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao enviar o e-mail de redefinição de senha" });
        
    }
}

export const resetPassword = async (req, res) => {
    const { email, codigo, newPassword } = req.body;

    try {
        if (!email || !codigo || !newPassword) {
            return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
        }

        const user = await prisma.users.findUnique({ where: { email } });
        const ong = await prisma.ongs.findUnique({ where: { emailONG: email }});

        if (!user && !ong) {
            return res.status(404).json({ error: "Usuário ou ONG não encontrado" });
        }

        const role = discoverType(user)

        if (role === "ONG") {
            const ong = await prisma.ongs.findUnique({ where: { emailONG: email }});

            if (!ong) {
                return res.status(404).json({ error: "ONG não encontrada" });
            }

            const dados_token = await prisma.userOngToken.findFirst({ where: { ongId: ong.id } });

            if (!dados_token) {
                return res.status(404).json({ error: "Token de redefinição de senha inválido" });
            }

            if (dados_token.expiresAt < new Date()) {
                return res.status(400).json({ error: "Token de redefinição de senha expirado" });
            }

            if (dados_token.token !== String(codigo)) {
                return res.status(400).json({ error: "Código de redefinição de senha inválido" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.ongs.update({
                where: { emailONG: email },
                data: { password: hashedPassword },
            });

            await prisma.userOngToken.deleteMany({
                where: { ongId: ong.id },
            });

        }
        else {

            const user = await prisma.users.findUnique({ where: { email: email }});

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            const dados_token = await prisma.userOngToken.findFirst({ where: { userId: user.id } });

            if (!dados_token) {
                return res.status(404).json({ error: "Token de redefinição de senha inválido" });
            }

            if (dados_token.expiresAt < new Date()) {
                return res.status(400).json({ error: "Token de redefinição de senha expirado" });
            }

            if (dados_token.token !== codigo) {
                return res.status(400).json({ error: "Código de redefinição de senha inválido" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.users.update({
                where: { email: email },
                data: { password: hashedPassword },
            });

            await prisma.userOngToken.deleteMany({
                where: { userId: user.id },
            });

        }

        return res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao atualizar ao resetar a senha" });
    }
}