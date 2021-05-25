import firebase from 'firebase';
import { Request, Response } from 'express';
import { admin, db } from '../utils/admin';
import { validateLoginData, validateSignUpData } from '../utils/validators';
import * as config from '../utils/firebaseConfig.json';
import { AuthData } from 'types';

firebase.initializeApp(config);

// Login
export async function loginUser(
  request: Request,
  response: Response
): Promise<Response<AuthData & { token: string }>> {
  const { role } = response.locals;
  console.log('role', role);

  try {
    const user = {
      email: request.body.email,
      password: request.body.password
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) return response.status(400).json(errors);

    const data = await firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    const token = await data.user?.getIdToken();
    if (!token) throw Error(`Couldn't get token`);
    const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
    // if (data.user) await admin.auth().setCustomUserClaims(data.user.uid, { role: 'admin' });

    return response.json({ token, ...user, role: decodedToken.role || 'user' });
  } catch (err) {
    console.error(err.message);
    return response.status(403).json({ error: err.message });
  }
}

// Sign up
export async function signUpUser(
  request: Request,
  response: Response
): Promise<Response<{ token: string }>> {
  try {
    const newUser = {
      email: request.body.email,
      password: request.body.password,
      confirmPassword: request.body.confirmPassword,
      role: request.body.role
    };

    const { valid, errors } = validateSignUpData(newUser);

    if (!valid) return response.status(400).json(errors);

    const doc = await db.doc(`/users/${newUser.email}`).get();

    if (doc.exists) {
      return response.status(400).json({ email: 'Email already in use' });
    }

    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);

    const userId = data.user?.uid;
    const token = await data.user?.getIdToken();
    const userCredentials = {
      email: newUser.email,
      id: userId
    };
    await db.doc(`/users/${newUser.email}`).set(userCredentials);

    return response.status(201).json({ token });
  } catch (err) {
    console.error(err);
    if (err.code === 'auth/email-already-in-use') {
      return response.status(400).json({ email: 'Email already in use' });
    } else {
      return response.status(500).json({ error: 'Something went wrong, please try again' });
    }
  }
}

export async function getUserDetail(
  request: Request,
  response: Response
): Promise<Response<{ userCredentials: { id: string; email: string } }>> {
  try {
    const doc = await db.doc(`/users/${request.body.user.username}`).get();
    if (!doc.exists) throw Error(`Such user doesn't exist`);
    const data = { userCredentials: doc.data() };
    return response.json(data);
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: err.message });
  }
}
