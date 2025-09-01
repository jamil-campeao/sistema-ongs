import prisma from "../db/client.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.posts.findMany({
            select: {
                id: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        location: true,
                        profileImage: true,
                        role: true,
                    }
                },
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        emailONG: true,
                        city: true,
                        profileImage: true,
                        role: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                images: {
                    select: {
                        content: true,
                        caption: true
                    }
                },
                likes: {
                    select: {
                        id: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                            }
                        },
                        ong: {
                            select: {
                                id: true,
                                nameONG: true,
                                role: true,
                            }
                        }
                    }
                },
                comments: {
                    select: {
                        id: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                                role: true,
                            }
                        },
                        ong: {
                            select: {
                                id: true,
                                nameONG: true,
                                profileImage: true,
                                role: true,
                            }
                        }
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                }
            }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar posts" });
        console.error(error)
    }
};

export const getPostByID = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.posts.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        location: true,
                        profileImage: true,
                        role: true,
                    }
                },
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        emailONG: true,
                        city: true,
                        profileImage: true,
                        role: true,
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                images: {
                    select: {
                        content: true,
                        caption: true
                    }
                },
                likes: {
                    select: {
                        id: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                            }
                        },
                        ong: {
                            select: {
                                id: true,
                                nameONG: true,
                                role: true,
                            }
                        }
                    }
                },
                comments: {
                    select: {
                        id: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                                role: true,
                            }
                        },
                        ong: {
                            select: {
                                id: true,
                                nameONG: true,
                                profileImage: true,
                                role: true,
                            }
                        }
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if (!post) {
            return res.status(404).json({ error: "Post não encontrado" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar post" });
    }
};

export const postPost = async (req, res) => {
    const { description, userId, projectId, images, tags, ongId } = req.body;
    if (!description) {
        return res.status(400).json({ error: "Campo descrição é obrigatório" });
    }

    try {
        if (projectId) {
            const existingPost = await prisma.posts.findFirst({
                where: {
                    description,
                    userId,
                    projectId
                },
            });
            if (existingPost) {
                return res.status(400).json({ error: "Já existe um post com description, userId e projectId idênticos" });
            }
        }

        let data = {
            description : description,
            images: {
                create: images && images.length > 0 ? images : [{
                    content: null,
                    caption: null
                }],
            },
            tags: {
                create: tags && tags.length > 0 ? tags : []
            }
        }

        if (userId) data.userId = userId;
        if (ongId) data.ongId = ongId;

        const newPost = await prisma.posts.create({
            data,
            include: {
                images: {
                    select: {
                        content: true,
                        caption: true
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
                        profileImage: true,
                        city: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        location: true,
                    }
                }
            }
        });
        const { updatedAt, ...postWithoutTimestamps } = newPost;
        res.status(201).json(postWithoutTimestamps);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao criar post" });
    }
};

export const postLike = async (req, res) => {
    const { id, tipo } = req.user;
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({ error: "ID do post não informado" });
    }

    let likeData = {
        postId: parseInt(postId),
    };

    if (tipo !== "ONG") {
        likeData.userId = id; // O ID do usuário que deu o like
    } else {
        likeData.ongId = id; // O ID da ONG que deu o like
    }

    try {
        // 1. Verifico se o like já existe para evitar duplicações
        let existingLike;
        if (tipo !== "ONG") {
            existingLike = await prisma.likes.findFirst({
                where: { userId: id, postId: parseInt(postId) },
            });
        } else {
            existingLike = await prisma.likes.findFirst({
                where: { ongId: id, postId: parseInt(postId) },
            });
        }

        if (existingLike) {
            return res.status(409).json({ error: "Você já curtiu este post." });
        }


        // 2. Crio o Like
        const createLike = await prisma.likes.create({ data: likeData });

        // 3. Busco o Like recém-criado com todas as informações necessárias
        // (user/ong que deu o like, e user/ong do post)
        const like = await prisma.likes.findUnique({
            where: { id: createLike.id },
            include: {
                user: { // O usuário que deu o like
                    select: {
                        id: true,
                        name: true,
                    }
                },
                ong: { // A ONG que deu o like
                    select: {
                        id: true,
                        nameONG: true,
                    }
                },
                post: {
                    select: {
                        id: true,
                        description: true, // Ou outro campo para o nome do post
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        },
                        ong: {
                            select: {
                                id: true,
                                nameONG: true,
                            }
                        }
                    }
                }
            }
        });

        // se o post não foi encontrado ou está incompleto
        if (!like || !like.post) {
            return res.status(404).json({ error: "Post não encontrado ou inválido." });
        }

        // --- ACTIVITIES ---

        // 4. Determino o nome de quem deu o like
        const likerName = like.user?.name || like.ong?.nameONG;
        if (!likerName) {
            console.error("Erro: Nome do curtir (liker) não encontrado.");
            return res.status(500).json({ error: "Erro interno: Liker não identificado." });
        }

        // 5. Determino o nome do autor do post
        const postAuthorName = like.post.user?.name || like.post.ong?.nameONG;
        if (!postAuthorName) {
            console.error("Erro: Nome do autor do post não encontrado.");
            return res.status(500).json({ error: "Erro interno: Autor do post não identificado." });
        }

        // 6. Construo a descrição da activity dinamicamente
        const activityDescription = `${likerName} curtiu o post de ${postAuthorName}.`;

        // 7. Crio a Activity
        const createActivity = await prisma.activities.create({
            data: {
                description: activityDescription,
                // O userId ou ongId da activity deve ser de QUEM DEU O LIKE, não do autor do post.
                userId: tipo !== "ONG" ? id : null, // Se for usuário, preenche userId, senão null
                ongId: tipo === "ONG" ? id : null, // Se for ONG, preenche ongId, senão null
                postId: parseInt(postId) // O ID do post curtido
            }
        });

        // --- FIM ACTIVITIES ---

        res.status(201).json(like);
    } catch (error) {
        console.error("Erro ao cadastrar like ou atividade:", error);
        res.status(500).json({ error: "Erro interno ao processar o like." });
    }
};

export const postComment =  async (req, res) => {
    const { id, tipo } = req.user;
    const { postId } = req.params;
    const { description } = req.body;

    if (!postId|| !description) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios"});
    }

    try {
        const data = {
            description: description,
            postId: parseInt(postId)
        };

        if (tipo !== "ONG") {
            data.userId = parseInt(id);
        } else {
            data.ongId = parseInt(id);
        }

        const createComment = await prisma.comments.create({ data });
        const comment = await prisma.comments.findUnique({
            where: { id: createComment.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                        role: true,
                    }
                },
                ong: {
                    select: {
                        id: true,
                        nameONG: true,
                        profileImage: true,
                        role: true,
                    }
                },
                post: {
                    select: {
                        id: true,
                        description: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true,
                                role: true,
                            }
                        },
                        ong: {
                            select: {
                                id: true,
                                nameONG: true,
                                profileImage: true,
                                role: true,
                            }
                        }
                    }
                }
            }
        });

        // --- ACTIVITIES ---

        // 4. Determino o nome de quem fez o comentário
        const commentName = comment.user?.name || comment.ong?.nameONG;
        if (!commentName) {
            console.error("Erro: Nome do comentador não encontrado.");
            return res.status(500).json({ error: "Erro interno: Comentador não identificado." });
        }

        // 5. Determino o nome do autor do post
        const postAuthorName = comment.post.user?.name || comment.post.ong?.nameONG;
        if (!postAuthorName) {
            console.error("Erro: Nome do autor do post não encontrado.");
            return res.status(500).json({ error: "Erro interno: Autor do post não identificado." });
        }

        // 6. Construo a descrição da activity dinamicamente
        const activityDescription = `${commentName} comentou no post de ${postAuthorName}.`;

        // 7. Crio a Activity
        const createActivity = await prisma.activities.create({
            data: {
                description: activityDescription,
                // O userId ou ongId da activity deve ser de QUEM DEU O LIKE, não do autor do post.
                userId: tipo !== "ONG" ? id : null, // Se for usuário, preenche userId, senão null
                ongId: tipo === "ONG" ? id : null, // Se for ONG, preenche ongId, senão null
                postId: parseInt(postId) // O ID do post curtido
            }
        });

        // --- FIM ACTIVITIES ---

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar comentário no post" });
        console.error(error)
    }
};

export const putPostByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, userId, projectId, images, likes, comments, activities, tags } = req.body;
        const post = await prisma.posts.findUnique({
            where: { id: parseInt(id) },
            include: {
                images: true,
                likes: true,
                comments: true,
                activities: true,
                tags: true
            }
        });
        if (!post) {
            return res.status(404).json({ error: "Post não encontrado" });
        }
        const filteredImages = images && images.length > 0
            ? images.filter((image) => !post.images.some(existingImage => existingImage.content === image.content))
            : [];
        const filteredTags = tags && tags.length > 0
            ? tags.filter((tag) => !post.tags.some(existingTag => existingTag.name === tag.name))
            : [];
        const updatedPost = await prisma.posts.update({
            where: { id: parseInt(id) },
            data: {
                description,
                userId,
                ...(projectId && projectId > 0 ? { projectId } : {}), //se o projectId foi informado ou for maior que 0 eu passo ele para o create, se não, não passo.,
                images: {
                    create: filteredImages
                },
                likes: {
                    create: likes && likes.length > 0 ? likes : []
                },
                comments: {
                    create: comments && comments.length > 0 ? comments : []
                },
                activities: {
                    create: activities && activities.length > 0 ? activities : []
                },
                tags: {
                    create: filteredTags
                }
            },
            include: {
                images: {
                    select: {
                        content: true,
                        caption: true
                    }
                },
                tags: {
                    select: {
                        name: true
                    }
                },
                likes: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                comments: {
                    select: {
                        id: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profileImage: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar post" });
    }
};

export const putCommentByID = async (req, res) => {
    try {
        const { postId } = req.params;
        const { commentId } = req.params;
        const { description } = req.body;
       
        const post = await prisma.posts.findUnique({ where: { id: parseInt(postId) }});
        const comment = await prisma.comments.findUnique({ where: { id: parseInt(commentId) }});
        if (!post || !comment) {
            return res.status(404).json({ error: "Post ou Comentário não encontrado" });
        }
        
        const updateComment = await prisma.comments.update({
            where: { id: parseInt(commentId) },
            data: {
                description,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true
                    }
                }
            }
        });
        res.status(200).json(updateComment);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar comentário" });
    }
};

export const deletePostByID = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.posts.findUnique({ where: { id: parseInt(id) } });
        if (!post) {
            return res.status(404).json({ error: "Post não encontrado" });
        }
        await prisma.posts.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar Post" });
    }
};

export const deleteLikeByID =  async (req, res) => {
    try {
        const { postId } = req.params;
        const { likeId } = req.params;

        const post = await prisma.posts.findUnique({ where: { id: parseInt(postId) }});
        const like = await prisma.likes.findUnique({ where: { id: parseInt(likeId) }});
        if (!post || !like) {
            return res.status(404).json({ error: "Post ou Like não encontrado" });
        }

        await prisma.likes.delete({ where: { id: parseInt(likeId) } });
        res.status(204).json({ message: "Like deletado com sucesso"});
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar like" });
    }
};

export const deleteCommentByID =  async (req, res) => {
    try {
        const { postId } = req.params;
        const { commentId } = req.params;

        const post = await prisma.posts.findUnique({ where: { id: parseInt(postId) }});
        const comment = await prisma.comments.findUnique({ where: { id: parseInt(commentId) }});
        if (!post || !comment) {
            return res.status(404).json({ error: "Post ou comentário não encontrado" });
        }

        await prisma.comments.delete({ where: { id: parseInt(commentId) } });
        res.status(204).json({ message: "Comentário deletado com sucesso"});
    } catch (error) {
        res.status(500).json({ error: "Erro ao deletar like" });
    }
};
