import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import errorHandler from './Middlewares/errorHandler.js';
import menuRouter from './Routes/menus.js';
import orderRouter from './Routes/orders.js';
import cartrouter from './Routes/cart.js';
import userRouter from './Routes/users.js';

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING);
const database = mongoose.connection;

// Middlewares
app.use(express.json());

// Routes
app.use('/api/menu', menuRouter);

app.use('/api/cart', cartrouter);

app.use('/api/auth', userRouter);

app.use('/api/orders', orderRouter);

// DB EmitEvents
database.on('error', (error) => console.log(error));
database.once('connected', () => {
    console.log('DB connected');

   	// Start server
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});

//Error hanteting
app.use(errorHandler);