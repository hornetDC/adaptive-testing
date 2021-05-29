import fetch from 'utils/fetch';
import { User, TestResultMark } from 'types';

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`/users`);
  const data = await response.json();
  return data;
}

export async function giveUserAdminRights(id: string): Promise<void> {
  await fetch(`/users/give-admin/${id}`, { method: 'POST' });
}

export async function submitTestResult(params: {
  userId: string;
  testResult: TestResultMark;
}): Promise<void> {
  await fetch(`/users/test-result`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' }
  });
}
