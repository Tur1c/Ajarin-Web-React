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
    categoryName: string;
  };
  user_id: AccountRegisterSchema;
  forum_replies: ForumReply[];
}

export interface ForumListOutput {
  forum_list: ForumList[];
}

export interface ForumList {
  questionId: number;
  title: string;
  question: string;
  createdDate: Date;
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
  user_id: any;
  question_id: number;
  likes: Likes[];
}

export interface Likes {
  likes_id: number;
  fr_id: number;
  email: string | null;
}

export interface newLikes {
  question_id: number;
  fr_id: number;
  email: string | null;
}


export interface AddForumSchema {
  question_title: string;
  question: string;
  question_category: string;
  question_level: string;
  user_email: string | null;
}

export interface InputReplySchema {
  reply: string;
  email: string | null;
  forum_id: number;
}

export interface EditReplySchema {
  reply: string;
  fr_id: number;
  question_id: number;
}

export interface ForumReplyListOutput {
  forum_reply_list: ForumReplyList[];
}

export interface ForumReplyList {
  fr_id: number;
  fr_reply: string;
  fr_likes: number;
  fr_user: AccountNoROutput;
  fr_replied_at: Date;
  likes: Likes[];
}

// export interface ReplySchema {
//   replies: Reply[];
// }

// export interface Reply {
//   fr_id: number;
//   fr_reply: string;
//   fr_likes: string;
//   user_id: AccountRegisterSchema;
//   question_id: number;
//   fr_replied_at: Date;
//   likes: Likes[];
// }

// export interface LikesListOutput {
//   LikesList: LikesList[];
// }

// export interface LikesList {
//   likes_id: number;
//   fr_id: number;
//   email: string;
// }

export interface LikesSchema {
  fr_id: number;
  email: string;
}

export function transfromToForumListOutput(
  response: ForumSchema,
  email: string | null
): ForumListOutput {
  console.log("di forum", response);
  const result: ForumListOutput = {
    forum_list: response.forums.map((data) => {
      return {
        questionId: data.question_id,
        question: data.question_desc,
        createdDate: data.created_date,
        title: data.question_title,
        totalComment: data.total_comment,
        questionCategory: data.category_id.categoryName,
        questionLevel: data.question_level,
        questionUser: transformToAccountNoROutput(data.user_id),
        forum_replies: data.forum_replies.map((data) => {
          return {
            fr_id: data.fr_id,
            fr_reply: data.fr_reply,
            fr_likes: data.likes.length,
            fr_user: data.user_id,
            fr_replied_at: data.fr_replied_at,
            likes: data.likes.map((likesData) => {
              return {
                likes_id: likesData.likes_id,
                fr_id: likesData.fr_id,
                email: likesData.email,
              };
            }),
          };
        }),
      };
    }),
  };
  console.log("model", result);
  result.forum_list.sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));
  return result;
}

export function transformToForumReplyListOutput(
  response: ForumReplySchema,
  email: string | null
): ForumReplyListOutput {
  console.log("replies", response);
  const result: ForumReplyListOutput = {
    forum_reply_list: response.forum_replies.map((data) => {
      return {
        fr_id: data.fr_id,
        fr_reply: data.fr_reply,
        fr_likes: data.fr_likes,
        fr_user: transformToAccountNoROutput(data.user_id),
        fr_replied_at: data.fr_replied_at,
        likes: data.likes.map((likesData) => {
          return {
            likes_id: likesData.likes_id,
            fr_id: likesData.fr_id,
            email: likesData.email,
          };
        }),
      };
    }),
  };

  // console.log("listreplies", result);
  // result.forum_reply_list.sort((a, b) => (a.fr_likes < b.fr_likes ? 1 : -1));

  return result;
}

export function transformToInputReplyListOutput(response: any): ForumReplyList {
  console.log("replies versi baru", response);
  const result: ForumReplyList = {
    fr_id: response.fr_id,
    fr_reply: response.fr_reply,
    fr_likes: response.fr_likes,
    fr_user: transformToAccountNoROutput(response.user_id),
    fr_replied_at: response.fr_replied_at,
    likes: [],
  };

  return result;
}

export function sortForum(
  forum_reply_list: ForumReplyList[]
): ForumReplyList[] {
  const sortedReplies = forum_reply_list.sort((a, b) => {
    if (a.fr_likes > b.fr_likes) {
      return -1;
    } else if (a.fr_likes < b.fr_likes) {
      return 1;
    } else {
      if (a.fr_replied_at < b.fr_replied_at) {
        return 1;
      } else if (a.fr_replied_at > b.fr_replied_at) {
        return -1;
      } else {
        return 0;
      }
    }
  });

  console.log("sorted", sortedReplies);
  return sortedReplies;
}
