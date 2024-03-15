import { Teacher, TeacherOutput, transformToTeacherOutput } from "../teacher/teacher-model";

import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';

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
}

export interface DiscussionListOutput {
  classList: ClassList[];
}

export interface CategorySchema {
  category_id: string;
  category_name: string;
}

export interface JoinDiscussionSchema {
  email: string | null | undefined;
  id: number;
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
  image?: string;
  teacher?: TeacherOutput;
  url: string;
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
        teacher: transformToTeacherOutput(data.teacher),
        url: data.disc_url,
      };
    }),
  };
  console.log(result,"berhasil ga");
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
  const result: CourseListOutput = {
    courseList: response.courses.map((data) => {
      return {
        id: data.course_id,
        price: data.course_price,
        chapter: data.course_chapter,
        title: data.course_title,
        description: data.course_description,
        level: data.course_level,
        category: data.category.category_name,
        image: data.course_image,
        teacher: transformToTeacherOutput(data.teacher),
        course_detail: data.course_details?.map((course) => {
          return {
            course_detail_chapter: course.course_detail_chapter,
            chapter_title: course.chapter_title,
            chapter_video: course.chapter_video,
            chapter_thumbnail: course.chapter_thumbnail,
          };
        }),
      };
    }),
  };
  console.log(result, "model class");

  return result;
}
