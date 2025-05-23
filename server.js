import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import userRouter from './routes/userRouter.js';
import billRouter from './routes/billRouter.js';
import cardRouter from './routes/cardRouter.js';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3005;

app.use(cors());
app.options("", cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    // Serve os arquivos estáticos do React
    app.use(express.static(path.join(__dirname, 'client/dist')));
}

app.use(express.json());

// USER ROUTES
app.use('/api/v1/users', userRouter);

// BILL ROUTES
app.use('/api/v1/bills', billRouter);

// CARD ROUTES
app.use('/api/v1/cards', cardRouter);

// ERROR ROUTE
app.use((err, req, res, next) => {
    res.status(500).json({ msg: `something went wrong ${err}`});
});

try {
    await mongoose.connect(process.env.MONGO_URL);

    app.listen(port, () => {
        console.log(`Server is running on port ${port}...`)
    });
} catch (error) {
    console.log(error);
    process.exit(1);
}

