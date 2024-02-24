export interface ForumSchema {
    forums: Forum[];
}

export interface Forum {
    question_id: number;
    question_title: string;
    question_desc: string;
    question_level: string;
    question_image: string;
    total_comment: number;
    created_date: Date;
    question_category: number;
    user_id: number;
}

export interface ForumListOutput {
    forum_list: ForumOutput[];
}

export interface ForumOutput {
    questionId: number;
    createdDate: Date;
    title: string;
    totalComment: number;
    questionCategory: number;
    questionLevel: string;
}

export function transfromToForumListOutput(
    response: ForumSchema
  ): ForumListOutput {
    console.log("masuk");
    console.log(response);
    const result: ForumListOutput = {
      forum_list: response.forums.map((data) => {
        return {
            questionId: data.question_id,
            createdDate: data.created_date,
            title: data.question_title,
            totalComment: data.total_comment,
            questionCategory: data.question_category,
            questionLevel: data.question_level,
        };
      }),
    };
    console.log(result, "lewat");
    return result;
  }