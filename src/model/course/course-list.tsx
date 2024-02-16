export interface DiscussionListSchema {
  discussions: Class[];
}

export interface Class {
  disc_title: string;
  disc_participant: string;
  disc_price: string;
  disc_date: Date;
  disc_starttime: Date;
  disc_endtime: Date;
  disc_description: string;
  disc_category: string;
  disc_image: string;
  categories: CategorySchema[];
}

export interface DiscussionListOutput {
  classList: ClassList[];
}

export interface CategorySchema {
  category_id: string;
  category_name: string;
}

export interface ClassList {
  title: string;
  maxPeople: string;
  price: string;
  date: Date;
  starttime: Date;
  endtime: Date;
  description: string;
  category: string[];
  image: string;
}

export function transfromToDiscussionListOutput(
  response: DiscussionListSchema
): DiscussionListOutput {
  const result: DiscussionListOutput = {
    classList: response.discussions.map((data) => {
      return {
        title: data.disc_title,
        maxPeople: data.disc_participant,
        price: data.disc_price,
        date: data.disc_date,
        starttime: data.disc_starttime,
        endtime: data.disc_endtime,
        description: data.disc_description,
        category: data.categories.map((data) => {
          return data.category_name;
        }),
        image: data.disc_image,
      };
    }),
  };
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
  course_category: string;
  course_image: string;
  categories: CategorySchema[];
}

export interface CourseListOutput {
  courseList: CourseList[];
}

export interface CourseList {
  price: number;
  chapter: string;
  title: string;
  description: string;
  category: string[];
  image: string;
}

export function transfromToCourseListOutput(
  response: CourseListSchema
): CourseListOutput {
  const result: CourseListOutput = {
    courseList: response.courses.map((data) => {
      return {
        price: data.course_price,
        chapter: data.course_chapter,
        title: data.course_title,
        description: data.course_description,
        category: data.categories.map((data) => {
          return data.category_name;
        }),
        image: data.course_image,
      };
    }),
  };
  return result;
}