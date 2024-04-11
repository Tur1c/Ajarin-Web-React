import {
  Teacher,
  TeacherOutput,
  transformToTeacherOutput,
} from "../teacher/teacher-model";

import moment from 'moment';
import 'moment-timezone';
import { StudentCourse, StudentCourseS } from "../Account";
import { string } from "yargs";
export interface DiscussionListSchema {
  discussions: Class[];
}

export interface Class {
  disc_id: number;
  disc_title: string;
  disc_participant: string;
  disc_price: string;
  disc_date: Date;
  disc_starttime: Date;
  disc_endtime: Date;
  disc_description: string;
  disc_level: string;
  disc_image: string;
  disc_url: string;
  category: {
    category_id: string;
    category_name: string;
  };
  teacher: Teacher;
  joinedParticipant: number;
}

export interface DiscussionListOutput {
  classList: ClassList[];
}

export interface CategorySchema {
  category_id: string;
  category_name: string;
}

export interface JoinDiscussionSchema {
  email: string|null|undefined;
  id: number | undefined;
}

export interface ClassList {
  id: number;
  title: string;
  maxPeople: string;
  price: string;
  date: string;
  starttime: Date;
  endtime: Date;
  description: string;
  level: string;
  category: string;
  image: string;
  url: string;
  teacher?: TeacherOutput;
  participant: number;
}

export interface AddDiscussionSchema {
  title: string;
  category: string;
  education_level: string;
  description: string;
  start_date: Date;
  end_date: Date;
  max_participant: string;
  price: string;
  link: string;
  user_id: number;
}

function changeDate(date: string) {
  const newDate = moment(date).format("MMMM Do YYYY");
  return newDate;
}

export function transfromToDiscussionListOutput(
  response: DiscussionListSchema
): DiscussionListOutput {
  console.log(response, "masuk");
  console.log(response, "masuk");
  const result: DiscussionListOutput = {
    classList: response.discussions.map((data) => {
      return {
        id: data.disc_id,
        title: data.disc_title,
        maxPeople: data.disc_participant,
        price: data.disc_price,
        date: changeDate(data.disc_date.toString()),
        starttime: data.disc_starttime,
        endtime: data.disc_endtime,
        description: data.disc_description,
        level: data.disc_level,
        category: data.category.category_name,
        image: data.disc_image,
        url: data.disc_url,
        teacher: transformToTeacherOutput(data.teacher),
        participant: data.joinedParticipant  
      };
    }),
  };
  console.log(result, "berhasil ga");
  return result;
}

// course

export interface CourseListSchema {
  courses: Course[];
}

export interface Course {
  course_id: number;
  course_price: number;
  course_chapter: string;
  course_title: string;
  course_description: string;
  course_level: string;
  course_image: string;
  total_sold_course: number;
  category: {
    category_id: string;
    category_name: string;
  };
  course_details: CourseDetailSchema[];
  teacher: Teacher;
}

export interface CourseDetailSchema {
  course_detail_id: number;
  course_id: number;
  course_detail_chapter: number;
  chapter_title: string;
  chapter_video: string;
  chapter_thumbnail: string;
}

export interface AddCourseSchema {
  title: string;
  category: string;
  education_level: string;
  description: string;
  chapter: string;
  price: string;
  user_id: number;
  image_link: string;
}

export interface AddCourseDetailSchema {
  title: string;
  video: string;
  thumbnail: string;
  pdf: string;
}

export interface CourseListOutput {
  courseList: CourseList[];
}

export interface CourseList {
  id: number;
  price: number;
  chapter: string;
  title: string;
  description: string;
  level: string;
  category: string;
  image: string;
  sold?: number;
  teacher?: TeacherOutput;
  course_detail: CourseDetailOutput[];
}

export interface CourseDetailOutput {
  course_detail_chapter: number;
  chapter_title: string;
  chapter_video: string;
  chapter_thumbnail: string;
}

export function transfromToCourseListOutput(
  response: CourseListSchema
): CourseListOutput {
  console.log(response.courses[0].total_sold_course, "total_sold");

  const result: CourseListOutput = {
    courseList: response.courses.map((data) => {
      return transformToCourseOutput(data);
    }),
  };
  console.log(result, "model class");

  return result;
}

export function transformToCourseOutput(response:Course): CourseList {
  const result: CourseList = {
        id: response.course_id,
        price: response.course_price,
        chapter: response.course_chapter,
        title: response.course_title,
        description: response.course_description,
        level: response.course_level,
        category: response.category.category_name,
        image: response.course_image,
        teacher: transformToTeacherOutput(response.teacher),
        sold: response.total_sold_course,


        course_detail:response.course_details?.map( (course) => {
          return {
            course_detail_chapter: course.course_detail_chapter,
            chapter_title: course.chapter_title,
            chapter_video: course.chapter_video,
            chapter_thumbnail: course.chapter_thumbnail,
          };
        }),
      }
  console.log(result, 'model class');
  
  return result;
}

export interface RateCourse{
  userid: string|undefined;
  courseid: number|undefined;
  rating: number;
  comment: string;
}

export interface CompleteChapter{
  userid: number;
  courseid: string;
  completed: string;
  total_chap: number;
}


export function transformToStudentCourseOutput(response:any){

}

