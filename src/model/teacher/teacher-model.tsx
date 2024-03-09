import { AccountOutput, AccountSchema, transfromToAccountOutput } from "../Account";

export interface InquiryTeacherSchema {
    teachers: Teacher[];
}

export interface Teacher {
    id: number;
    teacher_description: string;
    teacher_achievement: string;
    teacher_experience: string;
    teacher_education: string;
    teacher_cv_url: string;
    teacher_rating: string;
    account: AccountSchema;
}

export interface TeacherListOutput {
    teachers: TeacherOutput[];
}

export interface TeacherOutput {
    description: string;
    achievement: string;
    experience: string;
    education: string;
    cvUrl: string;
    rating: string;
    account: AccountOutput;
}

export function transfromToTeacherListOutput(
    response: InquiryTeacherSchema
  ): TeacherListOutput {
    const result: TeacherListOutput = {
      teachers: response.teachers.map((data) => {
        return {
          description: data.teacher_description,
          achievement: data.teacher_achievement,
          experience: data.teacher_experience,
          education: data.teacher_education,
          cvUrl: data.teacher_cv_url,
          rating: data.teacher_rating,
          account: transfromToAccountOutput(data.account)
        };
      }),
    };
    console.log(result);
    
    return result;
  }
