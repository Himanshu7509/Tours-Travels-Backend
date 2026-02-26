const managerMiddleware = (req, res, next) => {
    if (req.user.role !== "manager" && req.user.role !== "admin") {
        return res.status(403).json({ message: "Manager access required" });
    }
    next();
};

export default managerMiddleware;