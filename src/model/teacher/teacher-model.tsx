import {
  AccountNoROutput,
  AccountOutput,
  AccountRegisterSchema,
  AccountSchema,
  transformToAccountNoROutput,
  transfromToAccountOutput,
} from "../Account";

export interface InquiryTeacherSchema {
  teachers: Teacher[];
}

export interface Teacher {
    teacher_id: number;
    profile_description: string;
    achievement: string;
    experience: string;
    education: string;
    cv_data: string;
    rating: string;
    teacher_image: string;
    teacher_name: string;
    user: AccountRegisterSchema;
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
    image: string;
    name: string;
  account: AccountNoROutput;
}

export function transfromToTeacherListOutput(
    response: InquiryTeacherSchema
  ): TeacherListOutput {
    console.log(response,"jueng");
    const result: TeacherListOutput = {
      teachers: response.teachers.map((data) => {
        return transformToTeacherOutput(data)
      }),
    };
    console.log(result);
    
    return result;
  }

  export function transformToTeacherOutput(response: Teacher): TeacherOutput {
      console.log("masuk sini",response);
      const result: TeacherOutput = {
          id: response.teacher_id,
          description: response.profile_description,
          achievement: response.achievement,
          experience: response.experience,
          education: response.education,
          cvUrl: response.cv_data,
          rating: response.rating,
          image: response.teacher_image,
          name: response.teacher_name,
          account: transformToAccountNoROutput(response.user)
      }
      console.log("lewat");
      return result;
  }
