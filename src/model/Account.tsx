import { Class } from "./course/course-list";

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
  coin: number;
}

export interface AccountSchema {
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
  coin: number;
  studentdisc_list: StudentDisc[]
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
  coin: number;
  studentdisc_list: StudentDiscList[];
}

export function transfromToAccountOutput(
  response: AccountSchema
) : AccountOutput {
  console.log(response,"asdd");
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
    school: response.school,
    coin: response.coin,
    studentdisc_list: response.studentdisc_list.map( (data) => {
      return {
        disc: data.disc,
        status: data.status
      };
    }),
  };
  console.log(result);
  return result;
}

//AccountDiscussion
// export interface StudentDiscSchema {
//   studentdisc_list: StudentDisc[];
// }

export interface StudentDisc {
  disc: Class;
  status: string;
}

export interface StudentDiscOutput {
  studentdisc_list: StudentDiscList[];
}

export interface StudentDiscList {
  disc: Class;
  status: string;
}

// export function transformToAccountDiscOutput(response:AccountSchema):StudentDiscOutput{
//   const result:StudentDiscOutput = {
//     studentdisc_list: response.studentdisc_list.map( (data) => {
//       return {
//         disc: data.disc,
//         status: data.status
//       };
//     }),
//   }

//   console.log(result, "apa");
//   return result;
    
// }

