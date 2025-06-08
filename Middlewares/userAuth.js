import User from '../Models/modelUser.js';

const requireUserId = async (req, res, next) => {
    // Middleware to check if userId is provided in request body or query parameters
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: userId required' });
    }

    try {
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: user not found' });
        }

        req.user = user;
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

export default requireUserId;
