export type Question = {
  id: string;
  type: 'options' | 'input';
  difficulty: number;
  text: string;
  answer: string;
  options?: string[];
};

export type AuthData = {
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'user';
};

export type LoginData = Omit<AuthData, 'role'>;
