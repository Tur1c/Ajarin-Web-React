import { useEffect, useState } from "react";

import { format } from "date-fns";
import { BiCommentDetail } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "../../../api/axios";
import { AccountOutput } from "../../../model/Account";
import {
  EditReplySchema,
  ForumList,
  ForumReplyList,
  ForumReplyListOutput,
  InputReplySchema,
  newLikes,
  sortForum,
  transformToInputReplyListOutput,
} from "../../../model/forum/forum-model";
import Sidebar from "../../../shared/sidebar/Sidebar";
import "./forum.css";

const REPLY_URL = "/api/reply/add";
const EDIT_REPLY_URL = "/api/reply/edit/";
const DELETE_REPLY = "api/reply/delete?question_id=";
const LIKE_URL = "/api/likes/add";
const UNLIKE_URL = "/api/likes/delete";

// let currentForumReply: ForumReplyList[];

const ForumDetail = () => {
  const { state } = useLocation();

  const navigate = useNavigate();

  const isLogged = sessionStorage.getItem("jwt");
  const [isLoading, setIsLoading] = useState(false);
  const [newReplyAdded, setNewReplyAdded] = useState(false);

  const forum: ForumList = state.data;
  // const Reply: ForumReplyList = forum.forum_replies;

  const userRole = sessionStorage.getItem("role");

  let account: AccountOutput =
    userRole !== "Teacher"
      ? !state?.account?.firstName
        ? undefined
        : state.account
      : state.account;
  console.log(state, "forum state");

  const user: AccountOutput =
    userRole !== "Teacher"
      ? !state?.account?.firstName
        ? undefined
        : state.account
      : state.account;
  console.log(user, "user forum state");
  const email = sessionStorage.getItem("user");

  // console.log("ini user", user);
  // console.log("ini forum", forum);

  const [ForumReplyListData, setForumReplyListData] =
    useState<ForumReplyListOutput>({
      forum_reply_list: sortForum(forum.forum_replies),
    });

  console.log("forumreplylistdata", ForumReplyListData);

  const [totalComments, setTotalComments] = useState(0);

  const [text, setText] = useState<string>("");
  const [editText, setEditText] = useState<string>("");

  interface ButtonState {
    type: "toLike" | "toUnlike";
  }

  const [buttonState, setButtonState] = useState<ButtonState>({
    type: "toLike",
  });

  const handleClick = () => {
    setButtonState({ type: "toUnlike" });
  };

  // InputReply
  const handleSubmitReply = async (e: any) => {
    e.preventDefault();
    setText("");

    let inputReplySchema: InputReplySchema = {
      reply: text,
      email: user.email,
      forum_id: forum.questionId,
    };

    console.log("ini data sebelum ygy", ForumReplyListData);

    try {
      console.log("ini inputnya", inputReplySchema);
      const response = await axios.post(
        REPLY_URL,
        JSON.stringify(inputReplySchema),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      console.log("responsenya", response.data);
      const newReply: ForumReplyList = transformToInputReplyListOutput(
        response.data
      );

      const newReplyInputted: ForumReplyList[] = [
        ...ForumReplyListData.forum_reply_list,
        newReply,
      ];

      console.log("updated Reply", newReplyInputted);

      const newForumListData: ForumReplyListOutput = {
        forum_reply_list: sortForum(newReplyInputted),
      };

      setForumReplyListData(newForumListData);

      // changeCurrent(updatedReply);
      // console.log(currentForumReply);
      // window.location.reload();
    } catch (error) {
      console.error("Error adding data: ", error);
    }
    console.log("ini data sesudah ygy", ForumReplyListData);
    // setText("");
  };

  // Edit Reply

  const [editReplyID, setEditReplyID] = useState(0);
  const [editReply, setEditReply] = useState(false);

  const handleClickEditReply = (fr_id: number) => {
    setEditReplyID(fr_id);
    setEditReply(true);
  };

  //Ini buat button savenya lagi
  const handleEditReply = () => {
    // console.log(account);
    editDataReply();
    setEditReply(false);
  };

  const editDataReply = async () => {
    // setIsLoading(true);
    const editReply: EditReplySchema = {
      reply: editText,
      fr_id: ForumReplyListData.forum_reply_list[editReplyID].fr_id,
      question_id: forum.questionId,
    };

    setEditText("");

    try {
      console.log("schema", editReply);
      // console.log("id", currentForumReply[editReplyID].fr_id);
      const response = await axios.put(
        EDIT_REPLY_URL + ForumReplyListData.forum_reply_list[editReplyID].fr_id,
        JSON.stringify(editReply),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      // console.log("muncul pls");
      // console.log("apa munculnya", response.data.outputSchema);

      // const newReplyList: ForumReplyList[] = sortForum(
      //   response.data.outputSchema.forum_replies
      // );
      // console.log("new reply list", newReplyList);

      // const newReplyListData: ForumReplyListOutput = {
      //   forum_reply_list: [],
      // };

      // newReplyList.map((replies) => {
      //   newReplyListData.forum_reply_list.push(
      //     transformToInputReplyListOutput(replies)
      //   );
      // });

      // setForumReplyListData(newReplyListData);

      // setIsLoading(false);
      // ini masi bingung diapain
      // setAccount(transfromToAccountOutput(response.data.outputSchema));
    } catch {}
  };

  // Delete Reply
  const deleteReply = async (question_id: number, fr_id: number) => {
    // setIsLoading(true);

    try {
      const response = await axios.get(
        DELETE_REPLY + question_id + "&fr_id=" + fr_id,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + isLogged,
          },
          withCredentials: true,
        }
      );
      // setIsLoading(false);

      console.log("delete reply response", response.data.outputSchema);
      console.log("compare sama data ini", ForumReplyListData);

      const newReplyList: ForumReplyList[] = sortForum(
        response.data.outputSchema.replies
      );
      console.log("new reply list", newReplyList);

      const newReplyListData: ForumReplyListOutput = {
        forum_reply_list: [],
      };

      newReplyList.map((replies) => {
        newReplyListData.forum_reply_list.push(
          transformToInputReplyListOutput(replies)
        );
      });

      setForumReplyListData(newReplyListData);
    } catch (error) {
      // setIsLoading(true);
    }
  };

  const handleDeleteReply = (question_id: number, fr_id: number) => {
    deleteReply(question_id, fr_id);
  };

  // Likes Reply

  const handleLikeClick = async (fr_id: number) => {
    const newLike: newLikes = {
      question_id: forum.questionId,
      fr_id: fr_id,
      email: email,
    };

    console.log("ini data new ygy", newLike);

    try {
      const response = await axios.post(LIKE_URL, JSON.stringify(newLike), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        withCredentials: true,
      });
      console.log("responsenya", response);
      // const updatedForumReplyList: ForumReplyList[] =
      //   response.data.outputSchema;
      // console.log("hasilnya", updatedForumReplyList);
      // setForumReplyListData({ forum_reply_list: updatedForumReplyList });

      const newReplyList: ForumReplyList[] = sortForum(
        response.data.outputSchema.replies
      );
      console.log("new reply list", newReplyList);

      const newReplyListData: ForumReplyListOutput = {
        forum_reply_list: [],
      };

      newReplyList.map((replies) => {
        newReplyListData.forum_reply_list.push(
          transformToInputReplyListOutput(replies)
        );
      });

      setForumReplyListData(newReplyListData);
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };

  const handleUnlikeClick = async (fr_id: number) => {
    const newUnlike: newLikes = {
      question_id: forum.questionId,
      fr_id: fr_id,
      email: email,
    };
    console.log("data yg mao diunlike", newUnlike);

    try {
      const response = await axios.post(UNLIKE_URL, JSON.stringify(newUnlike), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        withCredentials: true,
      });

      const newReplyList: ForumReplyList[] = sortForum(
        response.data.outputSchema.replies
      );
      console.log("new reply list", newReplyList);

      const newReplyListData: ForumReplyListOutput = {
        forum_reply_list: [],
      };

      newReplyList.map((replies) => {
        newReplyListData.forum_reply_list.push(
          transformToInputReplyListOutput(replies)
        );
      });

      setForumReplyListData(newReplyListData);
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };

  const [isLoadingChangeAccount, setIsLoadingChangeAccount] = useState(false);

  const handleLoadingTrue = () => setIsLoadingChangeAccount(true);
  const handleLoadingFalse = () => setIsLoadingChangeAccount(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    console.log("triggeredddd");
    // sortForum(ForumReplyList);
    setTotalComments(ForumReplyListData.forum_reply_list.length);
  }, [ForumReplyListData]);

  return (
    <>
      {!isLoadingChangeAccount ? (
        <div className="all-page">
          <div className="sidebar-content">
            {userRole === "Teacher" ? (
              <Sidebar
                teacheracc={state.teacher}
                account={account}
                onLoadingTrue={handleLoadingTrue}
                onLoadingFalse={handleLoadingFalse}
              ></Sidebar>
            ) : (
              <Sidebar
                account={account}
                onLoadingTrue={handleLoadingTrue}
                onLoadingFalse={handleLoadingFalse}
              ></Sidebar>
            )}
          </div>
          <div className="forum-detail-container">
            {!isLoading ? (
              <>
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
                          className="img-fluid"
                          style={{
                            width: "68px",
                            height: "68px",
                            backgroundColor: "black",
                          }}
                          src={"/assets/" + forum.questionUser.urlImage}
                          alt=""
                        />
                        <div className="name-and-date">
                          <h3>{forum.questionUser.fullName}</h3>
                          <p style={{ marginTop: "0.25rem" }}>
                            Created on{" "}
                            {format(
                              forum.createdDate,
                              "MMMM do yyyy, h:mm:ss a"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="forum-info">
                        <div className="subject-edu">
                          {forum.questionCategory}
                        </div>
                        <div className="subject-edu">{forum.questionLevel}</div>
                        <div className="icon d-flex col gap-1 align-items-center">
                          <BiCommentDetail color="white" font-size={"1.5rem"} />
                          <h5>{totalComments}</h5>
                        </div>
                      </div>
                    </div>
                    <p style={{ marginTop: "1rem" }}>{forum.question}</p>
                    {/* Submit Reply */}
                    {user ? (
                      <>
                        <div className="reply-btn d-flex row w-100 m-0">
                          {/* <form
                      className="d-flex row w-100 m-0 gap-2"
                      onSubmit={handleSubmitReply}
                    > */}
                          <textarea
                            placeholder="Reply Something"
                            value={text}
                            className="input-reply-box p-2"
                            onChange={(e) => setText(e.target.value)}
                          />
                          <button
                            onClick={handleSubmitReply}
                            className="send-btn"
                            style={{ margin: "1rem 0rem" }}
                          >
                            Send
                          </button>
                          {/* </form> */}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="btn-container"
                          style={{ marginBottom: "1rem" }}
                        >
                          <button className="login-btn">
                            <Link
                              to={"/login"}
                              style={{
                                color: "var(--blue)",
                                fontWeight: "600",
                              }}
                            >
                              Login First to Reply
                            </Link>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {editReply ? (
                    <>
                      <h2 style={{ margin: "0rem 2rem", fontWeight: "600" }}>
                        Edit Reply
                      </h2>

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
                              <h3>
                                {
                                  ForumReplyListData.forum_reply_list[
                                    editReplyID
                                  ].fr_user.firstName
                                }{" "}
                                {
                                  ForumReplyListData.forum_reply_list[
                                    editReplyID
                                  ].fr_user.lastName
                                }
                              </h3>
                              <p>
                                Replied on{" "}
                                {ForumReplyListData.forum_reply_list[
                                  editReplyID
                                ].fr_replied_at.toString()}
                              </p>
                            </div>
                          </div>

                          <div className=" d-flex row w-100 m-0">
                            <textarea
                              style={{ marginTop: "1rem" }}
                              defaultValue={
                                ForumReplyListData.forum_reply_list[editReplyID]
                                  .fr_reply
                              }
                              className="input-reply-box p-2"
                              onChange={(e) => setEditText(e.target.value)}
                            />
                            <div
                              className="d-flex p-0"
                              style={{ gap: "1rem", marginTop: "1rem" }}
                            >
                              <div className="reply-btn">
                                <button
                                  onClick={handleEditReply}
                                  className="send-btn"
                                >
                                  Edit
                                </button>
                              </div>
                              <div className="cancel-btn">
                                <button
                                  type="button"
                                  onClick={() => setEditReply(false)}
                                  className="cancel-btn"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 style={{ margin: "0rem 2rem", fontWeight: "600" }}>
                        {totalComments} Answer
                      </h2>
                      {ForumReplyListData.forum_reply_list.map(
                        (data, index) => (
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
                                  src={"/assets/" + data.fr_user.profile_pic}
                                  alt=""
                                />
                                <div className="name-and-date">
                                  <h3>
                                    {data.fr_user.firstName}{" "}
                                    {data.fr_user.lastName}
                                  </h3>
                                  <p>
                                    Replied on{" "}
                                    {format(
                                      data.fr_replied_at,
                                      "MMMM do yyyy, h:mm:ss a"
                                    )}
                                  </p>
                                </div>

                                {data.fr_user.email === email ? (
                                  <div className="edit-and-delete">
                                    <button
                                      onClick={() =>
                                        handleClickEditReply(index)
                                      }
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteReply(
                                          forum.questionId,
                                          ForumReplyListData.forum_reply_list[
                                            index
                                          ].fr_id
                                        )
                                      }
                                    >
                                      Delete
                                    </button>
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>

                              <p style={{ marginTop: "1rem" }}>
                                {data.fr_reply}
                              </p>

                              {data.likes.some(
                                (like) => like.email === email
                              ) ? (
                                // Unlike
                                <div
                                  key={data.fr_id}
                                  onClick={() => handleUnlikeClick(data.fr_id)}
                                  className="unlike-btn d-flex "
                                >
                                  <button className="fw-bold" color="#ff1111">
                                    {data.fr_likes}{" "}
                                    <FaHeart
                                      color="#ff1111"
                                      font-size={"1rem"}
                                    />
                                  </button>
                                </div>
                              ) : (
                                // Likes
                                <div
                                  key={data.fr_id}
                                  onClick={() => handleLikeClick(data.fr_id)}
                                  className="like-btn d-flex"
                                >
                                  <button className="fw-bold">
                                    {data.fr_likes}{" "}
                                    <FaHeart color="white" font-size={"1rem"} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              </>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100%" }}
              >
                <svg
                  width="80"
                  height="80"
                  stroke="#fff"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <circle
                      cx="12"
                      cy="12"
                      r="9.5"
                      fill="none"
                      stroke-width="3"
                      stroke-linecap="round"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        dur="1.5s"
                        calcMode="spline"
                        values="0 150;42 150;42 150;42 150"
                        keyTimes="0;0.475;0.95;1"
                        keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-dashoffset"
                        dur="1.5s"
                        calcMode="spline"
                        values="0;-16;-59;-59"
                        keyTimes="0;0.475;0.95;1"
                        keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      dur="2s"
                      values="0 12 12;360 12 12"
                      repeatCount="indefinite"
                    />
                  </g>
                </svg>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <svg
            width="80"
            height="80"
            stroke="#fff"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <circle
                cx="12"
                cy="12"
                r="9.5"
                fill="none"
                stroke-width="3"
                stroke-linecap="round"
              >
                <animate
                  attributeName="stroke-dasharray"
                  dur="1.5s"
                  calcMode="spline"
                  values="0 150;42 150;42 150;42 150"
                  keyTimes="0;0.475;0.95;1"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  dur="1.5s"
                  calcMode="spline"
                  values="0;-16;-59;-59"
                  keyTimes="0;0.475;0.95;1"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  repeatCount="indefinite"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="2s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </g>
          </svg>
        </div>
      )}
    </>
  );
};

export default ForumDetail;
