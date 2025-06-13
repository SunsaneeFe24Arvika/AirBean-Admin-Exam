export default function errorHandler(error, req, res, next) {
    const statusCode = error.status || 500;  // fallback to 500 if no status provided
    res.status(statusCode).json({
        success: false,
        message: error.message || 'Internal Server Error',
    });
}