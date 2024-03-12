const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createUser(name, email, password) {
    return await prisma.user.create({
        data: {
            name,
            email,
            password,
        },
    });
}

async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
}

module.exports = { createUser, findUserByEmail };
