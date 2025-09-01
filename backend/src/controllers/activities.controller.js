import prisma from "../db/client.js";

export const getActivities = async (req, res) => {
    try {
        const activities = await prisma.activities.findMany({
            select: {
                id: true,
                description: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        description: true
                    }
                }
            }
        });
        res.status(200).json(activities);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar atividades" });
    }
};
