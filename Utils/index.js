import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function hashPassword(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

export async function comparePasswords(password, hashedPassword) {
    const isSame = await bcrypt.compare(password, hashedPassword);
    return isSame;
}

export function signToken(payload) {
    const token = jwt.sign(
        payload,
        process.env.MYSUPERSECRET,
        { expiresIn : 60 * 60 }
    );
    return token;
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.MYSUPERSECRET);
        return decoded;
    } catch(error) {
        console.log(error.message);
        return null;
    }
}