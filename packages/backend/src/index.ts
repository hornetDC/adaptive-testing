import * as functions from 'firebase-functions';
import * as express from 'express';
import { config as dotenv } from 'dotenv';
import { getQuestions } from './controllers/questions';
import { loginUser, signUpUser, getUserDetail } from './controllers/users';
import { auth } from './utils/auth';

dotenv({ path: `${__dirname}/../.env` });

const app = express();

app.use(express.json());

app.get('/questions', auth, getQuestions);

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.get('/user', auth, getUserDetail);

export const api = functions.https.onRequest(app);
