export type Question = {
  id: string;
  type: 'options' | 'input';
  difficulty: number;
  text: string;
  answer: string;
  options?: string[];
};

export type UserRole = 'admin' | 'manager' | 'user';

export type TestResultMark = '5A' | '4B' | '4C' | '3D' | '3E' | '2Fx' | '2F';

export type User = {
  id: string;
  email: string;
  role?: UserRole;
  testResult?: TestResultMark;
};

export type AuthData = {
  id: string;
  token: string;
  email: string;
  password: string;
  role: UserRole;
};

export type LoginData = {
  email: string;
  password: string;
};

export type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
