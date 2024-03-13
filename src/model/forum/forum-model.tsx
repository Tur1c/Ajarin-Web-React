import { AccountNoROutput, AccountOutput, AccountRegisterSchema, AccountSchema, transformToAccountNoROutput } from "../Account";

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
    category_id: {
      category_id: number;
      category_name: string;
    };
    user_id: AccountRegisterSchema;
}

export interface ForumListOutput {
    forum_list: ForumOutput[];
}

export interface ForumOutput {
    questionId: number;
    createdDate: Date;
    title: string;
    totalComment: number;
    questionCategory: string;
    questionLevel: string;
    questionUser: AccountNoROutput;
}

export function transfromToForumListOutput(
    response: ForumSchema
  ): ForumListOutput {
    console.log(response,"di forum");
    const result: ForumListOutput = {
      forum_list: response.forums.map((data) => {
        return {
            questionId: data.question_id,
            createdDate: data.created_date,
            title: data.question_title,
            totalComment: data.total_comment,
            questionCategory: data.category_id.category_name,
            questionLevel: data.question_level,
            questionUser: transformToAccountNoROutput(data.user_id)
        };
      }),
    };
    console.log(result, "model");
    result.forum_list.sort((a, b) =>
        a.createdDate < b.createdDate ? 1 : -1
      );
    return result;
  }