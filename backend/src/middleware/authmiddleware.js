require('dotenv').config();

const secretKey = process.env.SECRET_KEY;


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}

