const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({
            message: 'Gagal validasi data Mongoose',
            errors: errors
        });
    }

    if (err.code && err.code === 11000) {
        return res.status(400).json({
            message: 'Data duplikat: Novel atau Chapter dengan slug ini sudah ada.',
        });
    }

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;