export interface DiscussionListSchema {
  discussions: Class[];
}

export interface Class {
  discTitle: string;
  discGrade: string;
  discSubject: string;
  discLecturerName: string;
  discPeople: string;
  discMaxPeople: string;
  discPrice: string;
  discDate: string;
  discTime: string;
  discDescription: string;
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
    classList: response.discussions.map((data) => {
      return {
        title: data.discTitle,
        grade: data.discGrade,
        subject: data.discSubject,
        lecturerName: data.discLecturerName,
        people: data.discPeople,
        maxPeople: data.discMaxPeople,
        price: data.discPrice,
        date: data.discDate,
        time: data.discTime,
        description: data.discDescription,
      };
    }),
  };
  return result;
}
