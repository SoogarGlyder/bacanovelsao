import dotenv from 'dotenv';
dotenv.config({ path: './config/.env' }); 

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: 'Akses Ditolak: Authorization header hilang atau salah format.' 
        });
    }

    const token = authHeader.split(' ')[1];

    if (token === ADMIN_API_KEY) {
        next();
    } else {
        return res.status(403).json({ 
            message: 'Akses Ditolak: Kunci API tidak valid.' 
        });
    }
};

export { ADMIN_API_KEY };