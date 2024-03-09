import { Class, Course } from "./course/course-list";

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
  pic_name: string;
  pic_url: string;
  pic_type: string;
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
  pic_name: string;
  pic_url: string;
  pic_type: string;
  studentdisc_list: StudentDisc[];
  studentcourse_list: StudentCourse[];
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
  studentdisc_list: StudentDisc[];
  studentcourse_list: StudentCourse[];
  urlImage: string;
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
    urlImage: response.pic_url,
    // disc_list: response.,
    studentdisc_list: response.studentdisc_list?.map( (data) => {
      return {
        disc: data.disc,
        status: data.status
      };
    }),
    studentcourse_list: response.studentcourse_list.map( (data) => {
      return {
        course: data.course,
        status: data.status
      }
    })
  };
  console.log(result, "abc");
  return result;
}

export interface StudentDisc {
  disc: Class;
  status: string;
}

export interface StudentDiscOutput {
  studentdisc_list: StudentDisc[];
}


export interface StudentCourse {
  course: Course;
  status: string;
}

export interface StudentCourseOutput {
  studentcourse_list: StudentCourse[];
}


export interface TeacherRegisterSchema {
  profile_description: string;
  education: string;
  experience: string;
  achievement: string;
}

