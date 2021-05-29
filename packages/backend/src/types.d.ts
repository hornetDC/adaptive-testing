export type UserRole = 'admin' | 'manager' | 'user';

export type User = {
  id: string;
  email: string;
  role?: UserRole;
};

export type AuthData = {
  email: string;
  password: string;
  role: UserRole;
};

export type LoginData = Omit<AuthData, 'role'>;

export type Question = {
  id: string;
  type: 'options' | 'input';
  difficulty: number;
  text: string;
  answer: string;
  options?: string[];
};
