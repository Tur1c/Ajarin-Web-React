export interface AccountRegisterSchema {
  id: string;
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
  id?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  age: number;
  gender: string;
  phoneNumber: string;
  education: string;
  city: string;
  country: string;
  school: string;
  // disc_list: [];
}

export function transfromToAccountOutput(
  response: AccountRegisterSchema
) : AccountOutput {
  const result: AccountOutput = {
    id: response.id,
    firstName: response.firstName,
    lastName: response.lastName,
    fullName: response.firstName + " " + response.lastName,
    email: response.email,
    age: response.age,
    gender: response.gender,
    phoneNumber: response.phoneNumber,
    education: response.education,
    city: response.city,
    country: response.country,
    school: response.school
    // disc_list: response.
  };
  return result;
}
