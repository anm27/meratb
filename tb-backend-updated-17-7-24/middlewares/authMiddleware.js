const jwt = require('jsonwebtoken');

// Your secret key
const secret = 'Nitrobaba@272#$%&';

module.exports = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        console.log('Decoded Token:', decoded);  // Debugging log
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verification error:', err);  // Debugging log
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
