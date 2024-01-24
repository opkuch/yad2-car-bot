'use strict';
import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())

const corsOptions = {
	origin: [
		'http://127.0.0.1:80',
		'http://localhost:80',
		'http://localhost:5173',
		'http://localhost:3000',
		'http://127.0.0.1:5173',
	],
	credentials: true,
};
app.use(cors(corsOptions));

import userRoutes from './api/user/user.routes'
import { fetchAndNotify } from './services/notification.service';

app.use('/api/user', userRoutes)

setInterval(fetchAndNotify, 30 * 1000); // 3 hours in milliseconds


app.listen(5050, () => {
	console.log(`Server is running at http://localhost:5050`);
});