import jwt from "jsonwebtoken";
import prisma from "../db/client.js";

const authenticateUserOrOng = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const ong = await prisma.ongs.findUnique({ where: {emailONG: decoded.email}});
        const user = await prisma.users.findUnique({ where: { email: decoded.email }});

        if (!user && !ong) {
            return res.status(401).json({ error: "Usuário inválido" });
        }

        //Defino qual entidade foi encontrada (usuário ou ONG)
        const entidade = user || ong;
        const tipo = (user) =>  {
            if (user) {
                return user.role
            }
            else {
                return "ONG"
            }
        }

        // const tipo = user ? "USER" : "ONG";
        
        req.user = entidade;
        req.user.tipo = tipo(user);

        next();
    } catch (error) {
        return res.status(401).json({ error: `Token inválido ou expirado` });
    }
};

const generateToken = (entidade) => {
    const emailAux = entidade.email || entidade.emailONG;

    const payload = { id: entidade.id, 
                      email: emailAux, 
                      role: entidade.role || "ONG"
                    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    return token;
};

export { authenticateUserOrOng, generateToken };