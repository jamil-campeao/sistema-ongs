import prisma from "../src/db/client.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

function generateCNPJ() {
    const randomDigits = () => Math.floor(Math.random() * 9).toString();
    let cnpj = "";
    for (let i = 0; i < 12; i++) {
        cnpj += randomDigits();
    }
    return cnpj + "00";
}

async function main() {
    const adminEmail = "admin@acad.ufsm.br";
    const existingAdmin = await prisma.users.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
        await prisma.users.create({
            data: {
                name: "Super Administrator",
                email: adminEmail,
                password: await bcrypt.hash("admin", 10),
                location: faker.location.streetAddress({ useFullAddress: true }),
                role: "ADMIN",
                description: faker.lorem.text(),
                tags: {
                    create: [
                        { name: "ADMIN" },
                        { name: "VOLUNTARY" },
                        { name: "COLLABORATOR" }
                    ]
                }
            }
        });
    }

    for (let i = 0; i < 10; i++) {
        const email = faker.internet.email();
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (!existingUser) {
            await prisma.users.create({
                data: {
                    name: faker.person.fullName(),
                    email,
                    password: await bcrypt.hash(faker.internet.password(), 10),
                    location: faker.location.streetAddress({ useFullAddress: true }),
                    role: "COLLABORATOR",
                    description: faker.lorem.text(),
                    tags: {
                        create: [
                            { name: "ADMIN" },
                            { name: "VOLUNTARY" },
                            { name: "COLLABORATOR" }
                        ]
                    }
                },
            });
        }
    }

    for (let i = 0; i < 5; i++) {
        const cnpj = generateCNPJ();
        const existingOng = await prisma.ongs.findUnique({ where: { cnpj } });
        if (!existingOng) {
            await prisma.ongs.create({
                data: {
                    nameONG: faker.company.name(),
                    socialName: faker.company.name(),
                    cnpj,
                    foundationDate: new Date(faker.date.past()),
                    area: faker.lorem.word(),
                    goals: faker.company.buzzPhrase(),
                    cep: faker.location.zipCode(),
                    street: faker.location.street(),
                    number: faker.location.streetAddress(),
                    complement: faker.location.secondaryAddress(),
                    city: faker.location.city(),
                    district: "Centro",
                    state: faker.location.state(),
                    cellphone: faker.phone.number(),
                    emailONG: faker.internet.email(),
                    password: await bcrypt.hash(faker.internet.password(), 10),
                    socialMedia: faker.lorem.words(),
                    nameLegalGuardian: faker.person.fullName(),
                    description: faker.lorem.paragraph(),
                    profileImage: faker.image.dataUri({
                        width: 640,
                        height: 480,
                        type: 'svg-base64' 
                    }),
                    coverImage:faker.image.dataUri({
                        width: 640,
                        height: 480,
                        type: 'svg-base64' 
                    })
                },
            });
        }
    }

    for (let i = 0; i < 5; i++) {
        const name = faker.commerce.productName();
        const existingProject = await prisma.projects.findFirst({ where: { name } });
        if (!existingProject) {
            await prisma.projects.create({
                data: {
                    name,
                    description: faker.lorem.paragraph(),
                    ongId: Math.floor(Math.random() * 5) + 1,
                    images: {
                        create: [
                            {
                                content: faker.image.dataUri({ 
                                    width: 640,
                                    height: 480,
                                    type: 'svg-base64' 
                                })
                            }
                        ]
                    }
                },
            });
        }
    }

    for (let i = 0; i < 5; i++) {
        await prisma.posts.create({
            data: {
                description: faker.lorem.paragraph(),
                userId: Math.floor(Math.random() * 5) + 1,
                projectId: Math.floor(Math.random() * 5) + 1,
                images: {
                    create: [
                        {
                            content: faker.image.dataUri({ 
                                width: 640,
                                height: 480,
                                type: 'svg-base64' 
                            })
                        }
                    ]
                },
                tags: {
                    create: [
                        {
                            name: faker.book.genre()
                        }
                    ]
                }
            },
        });
    }

    for (let i = 0; i < 5; i++) {
        await prisma.comments.create({
            data: {
                description: faker.lorem.paragraph(),
                userId: Math.floor(Math.random() * 5) + 1,
                postId: Math.floor(Math.random() * 5) + 1,
            }
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
