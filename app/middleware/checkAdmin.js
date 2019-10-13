const isAdmin = (req, res, next) => {
    if (req.user.is_admin) {
        next();
    } else {
        return res.status(403).send({ message: 'User is not admin'});
    }
};

module.exports = isAdmin;