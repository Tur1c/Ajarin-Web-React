export interface AccountRegisterSchema {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  phoneNumber: string;
  education: string;
  city: string;
  country: string;
  school: string;
}

export interface AccountLoginSchema {
  email: string;
  password: string;
  token?: string; 
}

export interface AccountLoginOutput {
  token: string;
}

export interface AccountOutput{
  name: string;
  email: string;
  age: number;
  gender: string;
  phoneNumber: string;
  education: string;
  city: string;
  country: string;
  school: string;
}

export function transfromToAccountOutput(
  response: AccountRegisterSchema
) : AccountOutput {
  const result: AccountOutput = {
    name: response.firstName + " " + response.lastName,
    email: response.email,
    age: response.age,
    gender: response.gender,
    phoneNumber: response.phoneNumber,
    education: response.education,
    city: response.city,
    country: response.country,
    school: response.school
  };
  return result;
}
