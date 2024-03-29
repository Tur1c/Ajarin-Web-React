import moment from "moment";
import {
  AccountNoROutput,
  AccountRegisterSchema,
  transformToAccountNoROutput,
} from "../Account";
import { Class, ClassList, Course, CourseList, CourseListOutput, CourseListSchema, DiscussionListOutput, DiscussionListSchema, transfromToCourseListOutput, transfromToDiscussionListOutput } from "../course/course-list";

export interface InquiryTeacherSchema {
  teachers: Teacher[];
}

export interface Teacher {
  id: number;
  profile_description: string;
  achievement: string;
  experience: string;
  education: string;
  cv_data: string;
  rating: string;
  user: AccountRegisterSchema;
  discussion: Class[];
  courses: Course[];
}

export interface TeacherListOutput {
  teachers: TeacherOutput[];
}

export interface TeacherOutput {
  id: number;
  description: string;
  achievement: string;
  experience: string;
  education: string;
  cvUrl: string;
  rating: string;
  // image: string;
  // name: string;
  account: AccountNoROutput;
  discussion?: ClassList[];
  courses?: CourseList[];
  courseSold?: number;
}

export function transfromToTeacherListOutput(
  response: InquiryTeacherSchema
): TeacherListOutput {
  console.log(response, "jueng");
  const result: TeacherListOutput = {
    teachers: response.teachers.map((data) => {
      return transformToTeacherOutput(data);
    }),
  };
  console.log(result, "teacher transform");

  return result;
}

function changeDate(date: string) {
  const newDate = moment(date).format("MMMM Do YYYY");
  return newDate;
} 

function countCourseSold(courses: Course[]) {
  let count = 0;
  courses?.map((data) => {
    count += data.total_sold_course;
  });
  return count;
}

export function transformToTeacherOutput(response: Teacher): TeacherOutput {
  console.log("masuk sini", response);
  const result: TeacherOutput = {
    id: response.id,
    description: response.profile_description,
    achievement: response.achievement,
    experience: response.experience,
    education: response.education,
    cvUrl: response.cv_data,
    rating: response.rating,
    // image: response.teacher_image,
    // name: response.teacher_name,
    account: transformToAccountNoROutput(response.user),
    discussion: response.discussion?.map((data) => {
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
      }
    }),
    courses: response.courses?.map((data) => {
      return {
        id: data.course_id,
        price: data.course_price,
        chapter: data.course_chapter,
        title: data.course_title,
        description: data.course_description,
        level: data.course_level,
        category: data.category.category_name,
        image: data.course_image,
        sold: data.total_sold_course,
        course_detail: data.course_details?.map((course) => {
          return {
            course_detail_chapter: course.course_detail_chapter,
            chapter_title: course.chapter_title,
            chapter_video: course.chapter_video,
            chapter_thumbnail: course.chapter_thumbnail,
          };
        }),
      }
    }),
    courseSold: countCourseSold(response.courses),
  };
  console.log(result, "lewat teacher");
  return result;
}
