import React from 'react'
import { useLocation } from 'react-router'
import { CourseList, CourseListOutput } from '../../model/course/course-list';

const CourseDetail = () => {

    const {state} = useLocation();
    console.log(state);

    const course:CourseList = state;
  return (
    <div>{course.title}</div>
  )
}

export default CourseDetail