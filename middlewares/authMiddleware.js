const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Token non fourni.' });
        }

        const token = authHeader.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); // même clé que celle utilisée dans login

        req.auth = {
            userId: decodedToken.userId,
            userName: decodedToken.userName,
        };

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalide ou expiré.' });
    }
};
