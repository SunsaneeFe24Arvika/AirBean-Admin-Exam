import mongoose from 'mongoose';

// Skapa ett nytt schema för användare
const UserSchema = new mongoose.Schema({
	// Användarnamn
	username: {
		type: String,
		required: true,
		unique: true,
	},

	// Lösenord
	password: {
		type: String,
		required: true,
	},

	userId: {
		type: String,
		required: true,
		unique: true,
	},

	role: {
		type:String,
		enum: ['user', 'admin'],
		default: 'user',
		required: true,
	},
});

// Skapa en modell baserat på schemat ovan
const User = mongoose.model('User', UserSchema);

export default User;