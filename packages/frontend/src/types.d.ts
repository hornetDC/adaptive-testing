export type Question = {
  id: string;
  type: 'options' | 'input';
  difficulty: number;
  text: string;
  answer: string;
  options?: string[];
};

export type AuthData = {
  token: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'user';
};

export type LoginData = {
  email: string;
  password: string;
};

type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
