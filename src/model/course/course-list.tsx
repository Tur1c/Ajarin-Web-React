export interface DiscussionListSchema {
  class_list: Class[];
}

export interface Class {
  title: string;
  grade: string;
  subject: string;
  lecturer_name: string;
  people: string;
  max_people: string;
  price: string;
  date: string;
  time: string;
  description: string;
}

export interface DiscussionListOutput {
  classList: {
    title: string;
    grade: string;
    subject: string;
    lecturerName: string;
    people: string;
    maxPeople: string;
    price: string;
    date: string;
    time: string;
    description: string;
  }[];
}

export function transfromToDiscussionListOutput(
  response: DiscussionListSchema
): DiscussionListOutput {
  const result: DiscussionListOutput = {
    classList: response.class_list.map((data) => {
      return {
        title: data.title,
        grade: data.grade,
        subject: data.subject,
        lecturerName: data.lecturer_name,
        people: data.people,
        maxPeople: data.max_people,
        price: data.price,
        date: data.date,
        time: data.time,
        description: data.description,
      };
    }),
  };
  return result;
}
