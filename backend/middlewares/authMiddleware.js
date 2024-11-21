const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];

  
    jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, user) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: 'Token has expired. Please log in again.' });
            }
            console.error('Token verification error:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
