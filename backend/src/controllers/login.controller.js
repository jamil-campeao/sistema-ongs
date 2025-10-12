import bcrypt from "bcryptjs"; // Alterado para bcryptjs
import prisma from "../db/client.js";
import { generateToken } from "../services/authentication.js";


export const postLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try {
        const user = await prisma.users.findUnique({ where: { email } });
        const ong = await prisma.ongs.findUnique({ where: { emailONG: email }});

        if (!user && !ong) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const entidade = user || ong;
        const role = entidade.role || "ONG";

        const isPasswordValid = await bcrypt.compare(password, entidade.password); // bcryptjs funciona da mesma forma

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const token = generateToken(entidade);
        return res.status(200).json({ token, role});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};
