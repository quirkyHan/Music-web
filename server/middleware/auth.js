import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;


    if (!token) {
        return res.status(401).json({
            message: 'Akses ditolak. Silahkan login terlebih dahulu'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        next();
    }

    catch (error) {
        return res.status(401).json({
            message: 'Sesi tidak valid atau telah kadaluwarsa. Silahkan login kembali'
        })
    }
}