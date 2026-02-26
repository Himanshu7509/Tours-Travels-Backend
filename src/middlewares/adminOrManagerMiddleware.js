const adminOrManagerMiddleware = (req, res, next) => {
    if (!["admin", "manager"].includes(req.user.role)) {
        return res.status(403).json({
            message: "Admin or Manager access required"
        });
    }
    next();
};

export default adminOrManagerMiddleware;