
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import path from 'path';
import postRoutes from './routes/posts.js';
import userRouter from "./routes/user.js";

const app = express();

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/api/posts', postRoutes);
app.use('/api/user', userRouter);

const CONNECTION_URL = 'mongodb+srv://amazona:8365598a@cluster0.fdtaq.mongodb.net/memories?authSource=admin&replicaSet=atlas-55bbid-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const PORT = process.env.PORT|| 5000;

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/client/build/index.html')))
mongoose.connect(CONNECTION_URL, { })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

