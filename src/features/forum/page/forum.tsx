import { useEffect, useState } from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { BiComment } from "react-icons/bi";
import { IoSearch } from "react-icons/io5";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import axios from "../../../api/axios";
import { AccountOutput } from "../../../model/Account";
import {
  CategoryListOutput,
  CategorySchema,
  transfromToCategoryListOutput,
} from "../../../model/category/category-model";
import {
  ForumListOutput,
  ForumSchema,
  transfromToForumListOutput,
} from "../../../model/forum/forum-model";
import { ApiResponse } from "../../../model/schema/base_schema";
import { Pagination, Sidebar } from "../../../shared";
import AddForumModal from "./add-forum-modal";
import "./forum.css";

const CATEGORY_URL = "/api/category";
const FORUM_URL = "/api/forum";

const Forum = () => {
  const email = sessionStorage.getItem("user");
  const isLogged = sessionStorage.getItem("jwt");
  const userRole = sessionStorage.getItem("role");

  const [categories, setCategories] = useState<CategoryListOutput>({
    categories: [],
  });

  const [forumList, setForumList] = useState<ForumListOutput>({
    forum_list: [],
  });

  const [tempForumList, setTempForumList] = useState<ForumListOutput>({
    forum_list: [],
  });

  const { state } = useLocation();

  const account: AccountOutput = !state?.firstName ? undefined : state;
  // console.log(account);

  const [searchText, setSearchText] = useState("");

  const [categoryChosen, setCategoryChosen] = useState("All Discussions");

  const [sortCategory, setSortCategory] = useState("Latest Activity");

  const [isLoading, setIsLoading] = useState(false);

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get<ApiResponse<CategorySchema>>(
        CATEGORY_URL,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setCategories(transfromToCategoryListOutput(response.data.outputSchema));
    } catch (error) {}
  };

  const fetchForumData = async () => {
    try {
      const response = await axios.get<ApiResponse<ForumSchema>>(FORUM_URL, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      console.log("munculll", response.data.outputSchema);
      setForumList(
        transfromToForumListOutput(response.data.outputSchema, email)
      );

      setTempForumList(
        transfromToForumListOutput(response.data.outputSchema, email)
      );
    } catch (error) {}
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [classPerPage, setClassPerPage] = useState(5);

  const lastIndex = currentPage * classPerPage;
  const firstIndex = lastIndex - classPerPage;
  let allForum = forumList.forum_list;
  const lastIndexFiltered = allForum.length;
  let currentForum = forumList.forum_list.slice(firstIndex, lastIndex);

  function handlePageChange(value: any) {
    if (value === "&laquo;" || value === "... ") {
      setCurrentPage(1);
    } else if (value === "&lsaquo;") {
      if (currentPage !== 1) {
        setCurrentPage(currentPage - 1);
      }
    } else if (value === "&rsaquo;") {
      if (
        currentPage !== Math.ceil(forumList.forum_list.length / classPerPage)
      ) {
        setCurrentPage(currentPage + 1);
      }
    } else if (value === "&raquo;" || value === " ...") {
      setCurrentPage(Math.ceil(forumList.forum_list.length / classPerPage));
    } else {
      setCurrentPage(value);
    }
  }

  function handleCategoryChosenForum(category: string) {
    let count = 0;
    for (let i = 0; i < forumList.forum_list.length; i++) {
      if (forumList.forum_list[i].questionCategory === category) {
        count++;
      }
    }
    return count;
  }

  function handleClickSearch() {
    const findForum = tempForumList.forum_list.filter((u) =>
      u.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setForumList({ forum_list: findForum });
    handleSortCategory(categoryChosen);
  }

  function handleSortCategory(category: string) {
    console.log(category);
    console.log(forumList);

    if (category === "Latest Activity") {
      forumList.forum_list.sort((a, b) =>
        a.createdDate < b.createdDate ? 1 : -1
      );
    } else {
      forumList.forum_list.sort((a, b) =>
        a.totalComment < b.totalComment ? 1 : -1
      );
    }
    currentForum = forumList.forum_list.slice(firstIndex, lastIndex);
    console.log("hem", currentForum);
  }

  const [showModalAddForum, setShowModalAddForum] = useState(false);

  const handleCloseModalAddForum = () => setShowModalAddForum(false);

  const handleShowModalAddForum = () => {
    setShowModalAddForum(true);
  };

  useEffect(() => {
    fetchForumData();
    fetchCategoryData();
  }, []);
  console.log("munculah forum", forumList);

  return (
    <div className="all-page">
      {/* <Sidebar account={undefined}> */}
      <div className="sidebar-content">
        {userRole === "Teacher" ? 
          <Sidebar teacheracc={state.teacher} account={account}></Sidebar>
          :
          <Sidebar account={account}></Sidebar>
        }
      </div>
      <div className="forum-content">
        <div className="h-100">
          <div
            className="forum-container"
            style={{
              height: "100%",
              backgroundColor: "#11235A",
              border: "none",
            }}
          >
            <div className="" style={{ border: "none" }}>
              <div className="forum-top d-flex justify-content-between">
                <h3 className="text-white fw-bold">Forum Discussions</h3>
                {isLogged ? (
                  <>
                    <button
                      className="new-forum-btn"
                      onClick={() => handleShowModalAddForum()}
                    >
                      + Add New Forum
                    </button>
                  </>
                ) : (
                  <>
                    <button className="new-forum-btn">
                      <Link
                        to={"/login"}
                        style={{ color: "var(--blue)", textDecoration: "none" }}
                      >
                        + Add New Forum
                      </Link>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="d-flex row">
              <div className="forum-search-wrapper">
                <div
                  className="d-flex col"
                  style={{ background: "white", borderRadius: "0.5rem" }}
                >
                  <div className="search-left m-3">
                    <input
                      type="search"
                      name=""
                      id="search-input"
                      placeholder="Search"
                      style={{ width: "100%" }}
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setForumList(tempForumList);
                      }}
                    />
                  </div>

                  <div className="search-right p-3">
                    <button className="search-button" id="search">
                      <IoSearch
                        color="#6E6E6E"
                        font-size={"24"}
                        onClick={handleClickSearch}
                      />
                    </button>
                  </div>
                </div>
                <div
                  className="filter-dropdown-forum d-flex row"
                  // style={{
                  //   float: "right",
                  //   alignContent: "start",
                  // }}
                >
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                      split
                      variant="success"
                      id="dropdown-split-basic"
                    />

                    <Dropdown.Menu>
                      <Dropdown.Item
                        href="#/action-1"
                        onClick={() => {
                          setSortCategory("Latest Activity");
                          handleSortCategory("Latest Activity");
                        }}
                      >
                        Latest Activity
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#/action-2"
                        onClick={() => {
                          setSortCategory("Most Comment");
                          handleSortCategory("Most Comment");
                        }}
                      >
                        Most Comment
                      </Dropdown.Item>
                    </Dropdown.Menu>
                    <Button variant="success">Sort By : {sortCategory}</Button>
                  </Dropdown>
                </div>
              </div>

              <div className="forum-content-wrapper">
                <div
                  className="forum-content-list card"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                >
                  {categoryChosen === "All Discussions" ? (
                    <>
                      <div className="forum-content-list d-flex row">
                        {currentForum.map((data) => (
                          <Link
                            to={"/forum/" + data.title}
                            state={{ data, account }}
                          >
                            <div className="forum-list-container">
                              <div className="left d-flex">
                                <div className="" style={{ display: "block" }}>
                                  <img
                                    className="img-fluid bg-light"
                                    src={
                                      data.questionUser.urlImage ||
                                      `assets/default_picture.png`
                                    }
                                    alt=""
                                    style={{
                                      height: "5vh",
                                      width: "5vh",
                                      borderRadius: "0.5rem",
                                    }}
                                  />
                                </div>
                                <div className="forum-list-title ms-4">
                                  <h5
                                    className="m-0 text-decoration-none"
                                    style={{
                                      fontWeight: "600",
                                      color: "var(--black)",
                                    }}
                                  >
                                    {data.title}
                                  </h5>
                                  <span
                                    className="text-decoration-none"
                                    style={{
                                      fontSize: "14px",
                                      color: "var(--grey)",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Created by {data.questionUser.fullName} at{" "}
                                    {data.createdDate.toString()}
                                  </span>
                                </div>
                              </div>
                              <div className="right d-flex justify-content-center align-items-center">
                                <span className="pill badge badge-outlined text-white">
                                  {data.questionCategory}
                                </span>
                                <span className="pill badge badge-outlined text-white">
                                  {data.questionLevel}
                                </span>
                                <span
                                  style={{
                                    fontSize: "24px",
                                    color: "var(--black)",
                                  }}
                                >
                                  <BiComment />
                                </span>

                                <span
                                  style={{
                                    fontSize: "18px",
                                    color: "var(--black)",
                                  }}
                                >
                                  {data.totalComment}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="pagination-container">
                        <Pagination
                          totalClass={forumList.forum_list.length}
                          classPerPage={classPerPage}
                          onPageChange={handlePageChange}
                          currentPage={currentPage}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="card-body">
                        {currentForum.map((data) => {
                          if (data.questionCategory === categoryChosen) {
                            return (
                              <div className="forum-list-container">
                                <div className="left d-flex">
                                  <div
                                    className=""
                                    style={{ display: "block" }}
                                  >
                                    <img
                                      className="img-fluid bg-light"
                                      src={
                                        data.questionUser.urlImage ||
                                        `assets/default_picture.png`
                                      }
                                      alt=""
                                      style={{
                                        height: "5vh",
                                        width: "5vh",
                                        borderRadius: "0.5rem",
                                      }}
                                    />
                                  </div>
                                  <div className="forum-list-title ms-4">
                                    <h5
                                      className="m-0 text-decoration-none"
                                      style={{
                                        fontWeight: "600",
                                        color: "var(--black)",
                                      }}
                                    >
                                      {data.title}
                                    </h5>
                                    <span
                                      className="text-decoration-none"
                                      style={{
                                        fontSize: "14px",
                                        color: "var(--grey)",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Created by {data.questionUser.fullName} at{" "}
                                      {data.createdDate.toString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="right">
                                  <span className="badge badge-outlined text-white me-2">
                                    {data.questionCategory}
                                  </span>
                                  <span className="pill badge badge-outlined text-white">
                                    {data.questionLevel}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "24px",
                                      color: "var(--black)",
                                    }}
                                  >
                                    <BiComment />
                                  </span>

                                  <span
                                    style={{
                                      fontSize: "18px",
                                      color: "var(--black)",
                                    }}
                                  >
                                    {data.totalComment}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                      <Pagination
                        totalClass={handleCategoryChosenForum(categoryChosen)}
                        classPerPage={classPerPage}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="forum-categories-content"
        style={{
          overflow: "hidden",
          borderRadius: "0.5rem",
        }}
      >
        <div className="">
          <div
            className="d-flex align-items-center h-100"
            style={{
              backgroundColor: "var(--blue)",
            }}
          >
            <div className="forum-category-list card-text p-2">
              <p>
                <button
                  className={
                    categoryChosen === "All Discussions"
                      ? "active-category"
                      : ""
                  }
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "white",
                  }}
                  onClick={() => setCategoryChosen("All Discussions")}
                >
                  All Discussions
                </button>
              </p>
              {categories.categories.map((category, index) => {
                if (index === categories.categories.length - 1) {
                  return (
                    <p>
                      <button
                        className={
                          categoryChosen === `${category.categoryName}`
                            ? "active-category"
                            : ""
                        }
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                        key={index}
                        onClick={() => setCategoryChosen(category.categoryName)}
                      >
                        {category.categoryName}
                      </button>
                    </p>
                  );
                } else {
                  return (
                    <p>
                      <button
                        className={
                          categoryChosen === `${category.categoryName}`
                            ? "active-category"
                            : ""
                        }
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                        key={index}
                        onClick={() => setCategoryChosen(category.categoryName)}
                      >
                        {category.categoryName}
                      </button>
                    </p>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
      {/* </Sidebar> */}
      <AddForumModal
        show={showModalAddForum}
        onHide={handleCloseModalAddForum}
      ></AddForumModal>
    </div>
  );
};

export default Forum;
