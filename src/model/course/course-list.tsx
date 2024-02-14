export interface DiscussionListSchema {
  discussions: Class[];
}

export interface Class {
  disc_title: string;
  disc_participant: string;
  disc_price: string;
  disc_date: Date;
  disc_starttime: Date;
  disc_endtime:Date;
  disc_description: string;
  disc_category: string;
  disc_image: string;
}

export interface DiscussionListOutput {
  classList: {
    title: string;
    maxPeople: string;
    price: string;
    date: Date;
    starttime: Date;
    endtime: Date;
    description: string;
    category: string;
    image: string;
  }[];
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
        category: data.disc_category,
        image: data.disc_image
      };
    }),
  };
  return result;
}
