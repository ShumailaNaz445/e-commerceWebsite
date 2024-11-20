const jwt = require('jsonwebtoken');

const admin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify token
        if (decoded.isAdmin) {
            req.user = decoded; // Attach user info to the request
            next(); // Proceed to the next middleware or controller
        } else {
            res.status(403).json({ message: "Access denied. Admins only." });
        }
    } catch (error) {
        res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = admin;
