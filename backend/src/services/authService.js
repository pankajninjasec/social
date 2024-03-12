const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/user');
require('dotenv').config();

async function registerUser(req, res) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        const { password, ...data } = user;

        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error registering user' });
    }
}

async function loginUser(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (!await bcrypt.compare(req.body.password, user.password)) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ _id: user.id }, process.env.SECRET_KEY);

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.send({ message: 'Success' , token : token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error logging in' });
    }
}


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}



async function getUser(req, res) {
    try {
        const userId = req.user._id;
        if (userId) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        const { password, ...data } = user;
        res.send(data);
        }
        else{
            res.send('Not authenticated...')
        }
        

        
    } catch (error) {
        res.send('Not authenticated')
    }
}




function logoutUser(req, res) {
    res.cookie('jwt', '', { maxAge: 0 });

    res.send({ message: 'Success' });
}

module.exports = { registerUser, loginUser, getUser, logoutUser , authenticateToken};
