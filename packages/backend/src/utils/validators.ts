import { AuthData, LoginData, Question } from 'types';

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

export const validateQuestionData = (data: Partial<Question>): ValidationObject => {
  const errors: ErrorsObject = {};

  if (!['options', 'input'].includes(data.type!)) errors.type = 'Invalid type';

  if (isEmpty(data.difficulty) || Number(data.difficulty) < 0 || Number(data.difficulty) > 100)
    errors.difficulty = 'Invalid difficulty';

  if (isEmpty(data.text)) errors.text = 'Text is required';
  else if (data.text!.length > 300) errors.text = `Text can't exceed 300 characters`;

  if (isEmpty(data.answer)) errors.answer = 'Answer is required';
  else if (data.type === 'options' && !data.options?.includes(data.answer!))
    errors.answer = 'Answer must be a valid option';

  if (data.type === 'options' && isEmpty(data.options)) errors.options = 'Options are required';
  else if (data.type === 'options' && data.options!.length === 0)
    errors.options = 'Options must contain at least 1 item';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
