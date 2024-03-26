import {
  AccountNoROutput,
  AccountRegisterSchema,
  transformToAccountNoROutput,
} from "../Account";

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
  forum_replies: ForumReply[];
}

export interface ForumListOutput {
  forum_list: ForumList[];
}

export interface ForumList {
  questionId: number;
  question: string;
  createdDate: Date;
  title: string;
  totalComment: number;
  questionCategory: string;
  questionLevel: string;
  questionUser: AccountNoROutput;
  forum_replies: ForumReplyList[];
}

// ForumReply

export interface ForumReplySchema {
  forum_replies: ForumReply[];
}

export interface ForumReply {
  fr_id: number;
  fr_reply: string;
  fr_likes: number;
  fr_replied_at: Date;
  user_id?: any;
  question_id: number;
}

export interface InputReplySchema {
  reply: string;
  email: string;
  forum_id: number;
}

export interface ForumReplyListOutput {
  forum_reply_list: ForumReplyList[];
}

export interface ForumReplyList {
  fr_id: number;
  fr_reply: string;
  fr_likes: number;
  // fr_user: AccountNoROutput;
  fr_replied_at: Date;
}

export function transfromToForumListOutput(
  response: ForumSchema
): ForumListOutput {
  console.log(response, "di forum");
  const result: ForumListOutput = {
    forum_list: response.forums.map((data) => {
      return {
        questionId: data.question_id,
        question: data.question_desc,
        createdDate: data.created_date,
        title: data.question_title,
        totalComment: data.total_comment,
        questionCategory: data.category_id.category_name,
        questionLevel: data.question_level,
        questionUser: transformToAccountNoROutput(data.user_id),
        forum_replies: data.forum_replies.map((data) => {
          return {
            fr_id: data.fr_id,
            fr_reply: data.fr_reply,
            fr_likes: data.fr_likes,
            fr_replied_at: data.fr_replied_at,
          };
        }),
      };
    }),
  };
  console.log(result, "model");
  result.forum_list.sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));
  return result;
}

export function transformToForumReplyListOutput(
  response: ForumReplySchema
): ForumReplyListOutput {
  console.log("replies", response);
  const result: ForumReplyListOutput = {
    forum_reply_list: response.forum_replies.map((data) => {
      return {
        fr_id: data.fr_id,
        fr_reply: data.fr_reply,
        fr_likes: data.fr_likes,
        // fr_user: transformToAccountNoROutput(data.user_id),
        fr_replied_at: data.fr_replied_at,
      };
    }),
  };

  console.log("listreplies", result);
  result.forum_reply_list.sort((a, b) => (a.fr_likes < b.fr_likes ? 1 : -1));

  return result;
}
