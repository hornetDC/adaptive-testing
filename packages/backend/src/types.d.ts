export type Question = {
  id: string;
  type: 'options' | 'input';
  position: number;
  difficulty: number;
  text: string;
  answer: string;
  options?: string[];
};

export type AuthData = {
  email: string;
  password: string;
  admin?: boolean;
};
