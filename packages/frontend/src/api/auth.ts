import { AuthData, LoginData } from 'types';
import fetch from 'utils/fetch';

export async function login(params: LoginData): Promise<AuthData> {
  const response = await fetch(`/login`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  return data;
}
