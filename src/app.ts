import express from 'express';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(authRoutes);

const port = Number(process.env.PORT || 3000);

app.listen(port, 'localhost', () => {
  /* eslint-disable no-console */
  console.log(`Server listening on http://localhost:${port}`);
  /* eslint-enable no-console */
});

export default app;
