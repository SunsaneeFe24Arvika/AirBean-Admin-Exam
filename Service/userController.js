import User from '../Models/modelUser.js';
import generateUserId from '../Utils/generateUserID.js';
import { setCurrentUser, clearCurrentUser } from '../Utils/globalUser.js';
import Coupon from '../Models/modelsCoupon.js';
import { hashPassword, comparePasswords, signToken } from "../Utils/index.js"; 

// Registrera användare
export async function register(req, res) {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const userId = generateUserId();

        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            userId,
        });

        await newUser.save();

        const token = signToken({ userId, role });

        // Skapa en unik kupong till användaren (exempel)
       let couponData = null;
        if (role !== 'admin') {
            const now = new Date();
            const validTo = new Date();
            validTo.setDate(now.getDate() + 30);
            const couponCode = `WELCOME-${userId.slice(-5)}`;
            const newCoupon = new Coupon({
                coupId: userId,
                code: couponCode,
                discountType: 'percent',
                discountValue: 10,
                validFrom: now,
                validTo: validTo,
                active: true
            });
            await newCoupon.save();

            newUser.couponCode = couponCode;
            await newUser.save();

            couponData = {
                code: couponCode,
                discountType: 'percent',
                discountValue: 10,
                validFrom: now.toISOString().slice(0, 10),
                validTo: validTo.toISOString().slice(0, 10)
            };
        }
         res.status(201).json({
            message: 'User registered successfully',
            token,
            ...(couponData && { coupon: couponData })
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Logga in användare
export async function login(req, res) {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = signToken({ userId: user.userId, role: user.role });

        setCurrentUser(user.userId);

        // Anpassa svaret beroende på roll
        if (user.role === 'admin') {
            return res.status(200).json({
                message: 'Admin login successful',
                token,
                role: user.role,
                user: {
                    username: user.username,
                    userId: user.userId
                }
            });
        } else {
            return res.status(200).json({
                message: 'User login successful',
                token,
                role: user.role,
                user: {
                    username: user.username,
                    userId: user.userId
                }
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Logout
export async function logout(req, res) {
    clearCurrentUser();
    res.status(200).json({ message: 'Logout successful' });
}