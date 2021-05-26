import { Request, Response, NextFunction } from 'express';
import { admin } from './admin';

export function getAdminUsers() {
  return (process.env.ADMIN_USERS || '').replace(' ', '').split(',');
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).send({ message: 'Unauthorized' });

  if (!authorization.startsWith('Bearer')) return res.status(401).send({ message: 'Unauthorized' });

  const split = authorization.split('Bearer ');
  if (split.length !== 2) return res.status(401).send({ message: 'Unauthorized' });

  const token = split[1];

  try {
    const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
    // console.log('decodedToken', decodedToken);
    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      role: decodedToken.role,
      email: decodedToken.email
    };
    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ message: 'Unauthorized' });
  }
}

export function isAuthorized(opts: {
  hasRole: Array<'admin' | 'manager' | 'user'>;
  allowSameUser?: boolean;
}) {
  return (req: Request, res: Response, next: Function) => {
    const { role, uid } = res.locals;
    const { id } = req.params;

    if (opts.allowSameUser && id && uid === id) return next();

    if (!role) return res.status(403).send();

    if (opts.hasRole.includes(role)) return next();

    return res.status(403).send();
  };
}
