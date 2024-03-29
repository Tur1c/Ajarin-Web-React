import { Class, Course } from "./course/course-list";
import { Teacher } from "./teacher/teacher-model";

//AccountNoRelation
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
  pic_name?: string;
  pic_url?: string;
  pic_type?: string;
}

export interface AccountNoROutput {
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
  urlImage?: string;  
}

export function transformToAccountNoROutput(
  response: AccountRegisterSchema
) : AccountNoROutput {
  console.log(response,"asdd");
  const result: AccountNoROutput = {
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
  };
  console.log(result, "abc account hehe");
  return result;
}

//AccountWithRelation
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
  studentdisc_list?: StudentDisc[];
  studentcourse_list?: StudentCourse[];
  subscribed_lecturer?: SubscribedLecturer[];
}

export interface AccountLoginSchema {
  email: string;
  password: string;
  token?: string; 
  role?: string;
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
  subscribed_lecturer: SubscribedLecturer[];
  urlImage: string;
}
// ======================END OF AccountWithRelation

export interface AccountLoginSchema {
  email: string;
  password: string;
  token?: string; 
}

export interface AccountLoginOutput {
  token: string;
}



export function transfromToAccountOutput(
  response: AccountSchema
) : AccountOutput {
  console.log(response.subscribed_lecturer,"asdd");
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
    studentdisc_list: response.studentdisc_list ? response.studentdisc_list.map( (data) => {
      return {
        disc: data.disc,
        status: data.status
      };
    }) : [],
    studentcourse_list: response.studentcourse_list ? response.studentcourse_list.map( (data) => {
      return {
        course: data.course,
        status: data.status
      }
    }) : [],
    subscribed_lecturer: response.subscribed_lecturer ? response.subscribed_lecturer.map((data) => {
      return {
        teacher_id: data.teacher_id,
        achievement: data.achievement,
        education: data.education,
        experience: data.experience,
        profile_description: data.profile_description,
        rating: data.rating,
        user: data.user
      }
    }) : []
  };
  console.log(result, "abc account");
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

export interface SubscribedLecturer {
  teacher_id: string;
  profile_description: string;
  education: string;
  experience: string;
  achievement: string;
  rating: string;
  user: AccountSchema;
}


export interface TeacherRegisterSchema {
  profile_description: string;
  education: string;
  experience: string;
  achievement: string;
}




