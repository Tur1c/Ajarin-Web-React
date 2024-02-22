export interface ForumSchema {
    forum_list: Forum[];
}

export interface Forum {
    question_id: string;
    created_time: string;
    question_title: string;
    total_comment: string;
    question_category: string;
    question_level: string;
}

export interface ForumListOutput {
    forums: ForumOutput[];
}

export interface ForumOutput {
    createdTime: string;
    title: string;
    totalComment: string;
    questionCategory: number;
    questionLevel: string;
}

export function transfromToForumListOutput(
    response: ForumSchema
  ): ForumListOutput {
    const result: ForumListOutput = {
      forums: response.forum_list.map((data) => {
        return {
            createdTime: data.created_time,
            title: data.question_title,
            totalComment: data.total_comment,
            questionCategory: parseInt(data.question_category),
            questionLevel: data.question_level,
        };
      }),
    };
    return result;
  }