import { Class, Course, CourseList } from "./course/course-list";
import { TeacherOutput } from "./teacher/teacher-model";

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
  profile_pic?: string;
}

export function transformToAccountNoROutput(
  response: AccountRegisterSchema
): AccountNoROutput {
  // console.log(response,"asdd");
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
    urlImage: response.pic_name !== null ? response.pic_name : "default_picture.png",
    profile_pic: response.pic_name !== null ? response.pic_name : "default_picture.png",
  };
  // console.log(result, "abc account hehe");
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
  notifs: Notification[];
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

export interface AccountOutput {
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
  notification: Notification[];
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
): AccountOutput {
  console.log(response.pic_name === null,"account transform");
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
    urlImage: response.pic_name !== null? "assets/" + response.pic_name : "assets/" + "default_picture.png",
    studentdisc_list: response.studentdisc_list ? response.studentdisc_list
    .sort( (x,y) => x.discussion.disc_date.toString().localeCompare(y.discussion.disc_date.toString()) || x.discussion.disc_starttime.toString().localeCompare(y.discussion.disc_starttime.toString()))
    .map( (data) => {
      return {
        discussion: data.discussion,
        status: data.status
      };
    }) : [],
    studentcourse_list: response.studentcourse_list ? response.studentcourse_list.map( (data) => {
      return {
        course: data.course,
        status: data.status,
        completed_chap: data.completed_chap,
        rating: data.rating,
        comment: data.comment
      }
    }) : [],
    subscribed_lecturer: response.subscribed_lecturer ? response.subscribed_lecturer.map((data) => {
      return {
        id: data.id,
        achievement: data.achievement,
        education: data.education,
        experience: data.experience,
        profile_description: data.profile_description,
        rating: data.rating,
        user: data.user
      }
    }) : [],
    notification: response.notifs
  };
  console.log(result, "abc account");
  return result;
}

export interface StudentDisc {
  discussion: Class;
  status: string;
}

export interface StudentDiscOutput {
  studentdisc_list: StudentDisc[];
}

export interface StudentCourse {
  course: Course;
  status: string;
  completed_chap: string;
  rating: number;
  comment: string;
}

export interface StudentCourseS {
  course: CourseList | undefined;
  status: string;
  completed_chap: string;
  rating: number;
}

export interface StudentCourseOutput {
  studentcourse_list: StudentCourse[];
}

export interface SubscribedLecturer {
  id: number;
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

export interface PrivateDiscInput {
  title: string;
  subject: string;
  education: string;
  difficulty: string;
  date: string;
  start_time: string;
  end_time: string;
  coin: number;
  user: AccountNoROutput | undefined;
  teacher: TeacherOutput | undefined;
}

export interface PrivateDiscSchema {
  private_id: string;
  title: string;
  subject: string;
  education: string;
  difficulty: string;
  date: string;
  start_time: string;
  end_time: string;
  coin: number;
  user: AccountNoROutput;
  teacher: null;
}

export interface PrivateDiscOut {
  id: string;
  title: string;
  subject: string;
  education: string;
  difficulty: string;
  date: string;
  start_time: string;
  end_time: string;
  coin: number;
  status: string;
  user: AccountNoROutput;
}

export function TransformToPrivateDiscOut(
  response: PrivateDiscSchema
): PrivateDiscOut {
  return {
    id: response.private_id,
    title: response.title,
    subject: response.subject,
    education: response.education,
    difficulty: response.difficulty,
    date: response.date,
    start_time: response.start_time,
    end_time: response.end_time,
    coin: response.coin,
    status: "Ongoing",
    user: response.user,
  };
}

export interface Notification {
  notif_id: number;
  message: string;
}
