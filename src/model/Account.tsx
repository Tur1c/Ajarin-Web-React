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
}