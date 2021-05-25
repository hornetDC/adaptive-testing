import { AuthData, LoginData } from 'types';

type ErrorsObject = {
  [key: string]: string;
};

type ValidationObject = {
  errors: ErrorsObject;
  valid: boolean;
};

const isEmpty = (string: any) => {
  if (String(string).trim() === '') return true;
  else return false;
};

export const validateLoginData = (data: LoginData): ValidationObject => {
  const errors: ErrorsObject = {};

  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

const isEmail = (email: string) => {
  const emailRegEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
};

export const validateSignUpData = (
  data: AuthData & { confirmPassword: string }
): ValidationObject => {
  const errors: ErrorsObject = {};

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty';
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be valid email address';
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passowrds must be the same';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
