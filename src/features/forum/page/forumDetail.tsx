import { useEffect, useState } from "react";

import { AccountOutput } from "../../../model/Account";
import {
  ForumList,
  ForumReplyListOutput,
  InputReplySchema,
} from "../../../model/forum/forum-model";

import { BiCommentDetail } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router";
import axios from "../../../api/axios";
import Sidebar from "../../../shared/sidebar/Sidebar";
import "./forum.css";

const REPLY_URL = "/api/reply/add";
const GET_REPLY_URL = "/api/reply";

// let currentForumReply: ForumReplyList[];

const ForumDetail = () => {
  const { state } = useLocation();

  const navigate = useNavigate();

  const forum: ForumList = state.data;
  const user: AccountOutput = state.account;
  console.log("ini user", user);
  console.log("ini forum", forum);

  const [ForumReplyList, setForumReplyList] = useState<ForumReplyListOutput>({
    forum_reply_list: forum.forum_replies,
  });

  const [replyLikes, setReplyLikes] = useState(0);

  const currentForumReply = ForumReplyList.forum_reply_list.sort((a, b) =>
    a.fr_likes <= b.fr_likes ? 1 : -1
  );

  const totalComments: number = currentForumReply.length;
  console.log("CurrForum", currentForumReply);

  // console.log("currForumReply", currentForumReply);
  const isLogged = sessionStorage.getItem("jwt");

  const [text, setText] = useState<string>("");

  interface ButtonState {
    type: "toLike" | "toUnlike";
  }

  const [buttonState, setButtonState] = useState<ButtonState>({
    type: "toLike",
  });

  const handleClick = () => {
    setButtonState({ type: "toUnlike" });
  };

  //Reply Input

  const handleSubmitReply = async (e: any) => {
    e.preventDefault();
    setText("");

    try {
      let schema: InputReplySchema = {
        reply: text,
        email: user.email,
        forum_id: forum.questionId,
      };
      console.log("ini inputnya", schema);
      const response = await axios.post(REPLY_URL, JSON.stringify(schema), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        withCredentials: true,
      });

      // const tesData = response.data;
      const updatedReply = [...ForumReplyList.forum_reply_list, response.data];
      setForumReplyList({ forum_reply_list: updatedReply });
      // console.log("ini kebaca apa coba", tesData);

      // fetchDataReply();

      // const newForumList = await axios.get<ApiResponse<ForumReplySchema>>(
      //   FORUM_URL,
      //   {
      //     headers: { "Content-Type": "application/json" },
      //     withCredentials: true,
      //   }
      // );

      // setForumReplyList(
      //   transformToForumReplyListOutput(newForumList.data.outputSchema)
      // );

      console.log("COBA", response);
      // window.location.reload();
      // if ((response.data.errorSchema.message = "Sukses")) {
      //   forumReply.callBack(response.data.errorSchema.message);
      // }
    } catch (error) {
      console.error("Error adding data: ", error);
    }

    // setText("");
  };
  // console.log("masuk reply ga", forumReply);

  // function handleLikes(props: any) {
  //   let count = 0;
  //   // for (let i = 0; i < currentForumReply.length; i++) {
  //   //   if (currentForumReply[i].fr_id ) {

  //   //   }
  //   // }
  //   return count;
  // }

  const handleLike = (like: number) => {
    let newValue = like + 1;
    setReplyLikes(newValue);
  };

  useEffect(() => {}, [ForumReplyList]);

  return (
    <div className="all-page">
      <div className="sidebar-content">
        <Sidebar account={user}></Sidebar>
      </div>
      <div className="forum-detail-container">
        <div className="forum-detail-header">
          <div className="close-btn">
            <IoIosCloseCircleOutline
              style={{
                color: "#fff",
                width: "36px",
                height: "36px",
                cursor: "pointer",
              }}
              onClick={() => navigate(-1)}
            />
          </div>
          <div className="forum-detail-title">
            <h1>{forum.title}</h1>
          </div>
        </div>
        <div className="forum-detail-content">
          <div className="forum-question">
            <div className="forum-question-top">
              <div className="user-profile">
                <img
                  className=""
                  style={{
                    width: "68px",
                    height: "68px",
                    backgroundColor: "black",
                  }}
                  src={`assets/algorithm.jpeg`}
                  alt=""
                />
                <div className="name-and-date">
                  <h3>{forum.questionUser.fullName}</h3>
                  <p style={{ marginTop: "0.25rem" }}>
                    Created on {forum.createdDate.toString()}
                  </p>
                </div>
              </div>
              <div className="forum-info">
                <div className="subject-edu">{forum.questionCategory}</div>
                <div className="subject-edu">{forum.questionLevel}</div>
                <div className="icon d-flex col gap-1">
                  <BiCommentDetail color="white" font-size={"1.5rem"} />
                  <h5>{totalComments}</h5>
                </div>
                <div className="icon d-flex col gap-1">
                  <FaRegEye color="white" font-size={"1.5rem"} />
                  <h5>3609</h5>
                </div>
              </div>
            </div>
            <p style={{ marginTop: "1rem" }}>{forum.question}</p>
            <div className="reply-btn d-flex col">
              <form
                className="d-flex row w-100 m-0 gap-2"
                onSubmit={handleSubmitReply}
              >
                <textarea
                  value={text}
                  className="input-reply-box"
                  onChange={(e) => setText(e.target.value)}
                />
                <button className="send-btn">Send</button>
              </form>
            </div>
          </div>

          <h2 style={{ margin: "0rem 2rem", fontWeight: "600" }}>
            {totalComments} Answer
          </h2>
          {currentForumReply.map((data) => (
            <div className="forum-answer">
              <div className="answer-container">
                <div className="user-profile">
                  <img
                    className=""
                    style={{
                      width: "4rem",
                      height: "4rem",
                      backgroundColor: "black",
                    }}
                    src={`assets/oracle.png`}
                    alt=""
                  />
                  <div className="name-and-date">
                    <h3>Name</h3>
                    <p>Replied on {data.fr_replied_at.toString()}</p>
                  </div>
                </div>
                <p style={{ marginTop: "1rem" }}>{data.fr_reply}</p>
                <div
                  onClick={() => handleLike(data.fr_likes)}
                  className="like-btn d-flex"
                >
                  <button className="fw-bold">
                    {data.fr_likes} <FaHeart color="white" font-size={"1rem"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumDetail;
