module.exports = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(403).send('Unauthorized');
    }
    next();
};