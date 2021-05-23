const API_BASE = '/adaptive-testing/us-central1/api';

const tryParseJSON = (json: string): object | null => {
  if (!json) return null;

  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error(`Failed to parse unexpected JSON response: ${json}`);
  }
};

function FetchException(this: any, response: Response, responseData?: any) {
  this.message = response.statusText;
  this.status = response.status;
  this.response = responseData;
}

const handleError = async (response: Response) => {
  const data = tryParseJSON(await response.text());
  throw new FetchException(response, data);
};

const fetch = async (input: string, init?: RequestInit) => {
  const url = API_BASE + input;
  const token = localStorage.getItem('authToken') || '';
  const response = await window.fetch(url as any, {
    ...init,
    headers: { Authorization: token, ...init?.headers }
  });
  if (!response.ok) await handleError(response);

  return response;
};

export default fetch;
