import User from '../Models/modelUser.js';
import generateUserId from '../Utils/generateUserID.js';
import { setCurrentUser, clearCurrentUser } from '../Utils/globalUser.js';
import Coupon from '../Models/modelsCoupon.js';

// Registrera användare
export const register = async (req, res) => {
	try {
		const { username, password } = req.body; // Hämtar data från request body

		// Kontrollera att både username och password har skickats med
		if (!username || !password) {
			return res
				.status(400)
				.json({ message: 'Username and password are required' });
		}

		// Kontrollera om användarnamnet redan finns i databasen
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(409).json({ message: 'Username already exists' });
		}

		const userId = generateUserId();

		// Skapa en ny användare
		const newUser = new User({
			username,
			password,
			userId,

		});

		// Spara användaren i databasen
		await newUser.save();


		// Skapa en unik kupong till användaren (exempel)
		const now = new Date();
		const validTo = new Date();
		validTo.setDate(now.getDate() + 30); // giltig i 30 dagar
        const couponCode = `WELCOME-${userId.slice(-5)}`; // t.ex. "WELCOME-abc12"
        const newCoupon = new Coupon({
            coupId: userId,
            code: couponCode,
            discountType: 'percent',
            discountValue: 10, // 10% rabatt
			validFrom: now,
    		validTo: validTo,    
            active: true
        });
        await newCoupon.save();

		// (Valfritt) Lägg till kupongkod på användaren
        newUser.couponCode = couponCode;
        await newUser.save();

		// Skicka tillbaka ett svar om registreringen lyckades och ger 10 % rabatt för nya kunder
		res.status(201).json({ 
			message: 'User registered successfully',
			coupon: {
        		code: couponCode,
        		discountType: 'percent',
        		discountValue: 10,
				validFrom: now.toISOString().slice(0, 10), // Endast datum (YYYY-MM-DD)
        		validTo: validTo.toISOString().slice(0, 10) 
    		} 
		});
	} catch (error) {
		console.error('Register error:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

// Logga in användare
export const login = async (req, res) => {
	try {
		const { username, password } = req.body; // Hämta data från request body

		// Leta upp användaren i databasen baserat på username
		const user = await User.findOne({ username });

		// Om användaren inte finns eller lösenordet inte matchar
		if (!user || user.password !== password) {
			return res
				.status(401)
				.json({ message: 'Invalid username or password' });
		}

		// Om inloggning lyckas
		res.status(200).json({ message: 'Login successful' });

		// Sätt den aktuella användaren i globala användare
		setCurrentUser(user.userId);

	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

// Logout
export const logout = (req, res) => {
	res.status(200).json({ message: 'Logout successful' });
	clearCurrentUser();
};
