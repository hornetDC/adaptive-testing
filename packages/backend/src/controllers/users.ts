import firebase from 'firebase';
import { Request, Response } from 'express';
import { admin, db } from '../utils/admin';
import { validateLoginData, validateRegistrationData } from '../utils/validators';
import * as config from '../utils/firebaseConfig.json';
import { AuthData, User } from 'types';

firebase.initializeApp(config);

// Login
export async function loginUser(
  req: Request,
  res: Response
): Promise<Response<AuthData & { token: string }>> {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    const data = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    const token = await data.user?.getIdToken();
    if (!token) throw Error(`Couldn't get token`);
    const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);

    return res.json({ token, id: data.user?.uid, role: decodedToken.role || 'user', ...user });
  } catch (err) {
    console.error(err.message);
    return res.status(403).json({ error: err.message });
  }
}

// Sign up
export async function registerUser(
  req: Request,
  res: Response
): Promise<Response<{ token: string }>> {
  try {
    const user: AuthData = {
      email: req.body.email,
      password: req.body.password,
      role: 'user'
    };

    const { valid, errors } = validateRegistrationData(user);

    if (!valid) return res.status(400).json(errors);

    const doc = await db.doc(`/users/${user.email}`).get();

    if (doc.exists) {
      return res.status(400).json({ email: 'Email already in use' });
    }

    const data = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);

    const userId = data.user!.uid;

    await admin.auth().setCustomUserClaims(userId, { role: user.role });

    const token = await data.user?.getIdToken();
    const userCredentials = { email: user.email, id: userId };
    await db.doc(`/users/${user.email}`).set(userCredentials);

    return res.status(201).json({ token, id: userId, ...user });
  } catch (err) {
    console.error(err);
    if (err.code === 'auth/email-already-in-use')
      return res.status(400).json({ error: 'Email already in use' });
    else return res.status(500).json({ error: 'Something went wrong, please try again' });
  }
}

export async function getUsers(_req: Request, res: Response): Promise<Response<User[]>> {
  try {
    const result = await admin.auth().listUsers();
    const users = result.users.map(item => ({
      id: item.uid,
      email: item.email,
      ...item.customClaims
    }));
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function giveUserAdminRights(req: Request, res: Response): Promise<Response<User[]>> {
  try {
    const { id } = req.params;
    if (!id) throw Error('No ID');

    await admin.auth().setCustomUserClaims(id, { role: 'admin' });
    return res.status(200).json('success');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function submitTestResult(req: Request, res: Response): Promise<Response<User[]>> {
  try {
    const { userId, testResult } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is missing' });
    if (!testResult) return res.status(400).json({ error: 'testResult is missing' });

    const user = await admin.auth().getUser(userId);
    await admin.auth().setCustomUserClaims(userId, { ...user.customClaims, testResult });
    return res.status(200).json('success');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
