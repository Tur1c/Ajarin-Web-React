import { useEffect, useState } from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { BiComment } from "react-icons/bi";
import { IoSearch } from "react-icons/io5";
import axios from "../../../api/axios";
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
import "./forum.css";

const CATEGORY_URL = "/api/category";
const FORUM_URL = "/api/forum";

const Forum = () => {
  const [categories, setCategories] = useState<CategoryListOutput>({
    categories: [],
  });

  const [forumList, setForumList] = useState<ForumListOutput>({
    forum_list: [],
  });

  const [categoryChosen, setCategoryChosen] = useState("All Discussions");

  const [sortCategory, setSortCategory] = useState("Latest Activity");

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
      setForumList(transfromToForumListOutput(response.data.outputSchema));
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategoryData();
    fetchForumData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [classPerPage, setClassPerPage] = useState(5);

  const lastIndex = currentPage * classPerPage;
  const firstIndex = lastIndex - classPerPage;
  const currentForum = forumList.forum_list.slice(firstIndex, lastIndex);

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
    console.log(count);

    return count;
  }

  return (
    <>
      <Sidebar account={undefined}>
        <div className="forum-content">
          <div className="container-fluid p-3">
            <div className="row">
              <div className="col-10">
                <div
                  className="card"
                  style={{
                    height: "97vh",
                    backgroundColor: "#11235A",
                    border: "none",
                  }}
                >
                  <div className="card-header" style={{ border: "none" }}>
                    <div className="card-title d-flex justify-content-between pt-4">
                      <h3 className="text-white fw-bold">Forum Discussions</h3>
                      <button className="px-3">+ Add new Forum</button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="search-wrapper-forum">
                      <div className="search-container-forum">
                        <IoSearch />
                        <input
                          type="search"
                          name=""
                          id="search-input"
                          placeholder="Search"
                        />
                        <button id="search">Search</button>
                      </div>
                      <div className="search-dropdown-forum">
                        <Dropdown as={ButtonGroup}>
                          <Button variant="success">
                            Sort By: {sortCategory}
                          </Button>

                          <Dropdown.Toggle
                            split
                            variant="success"
                            id="dropdown-split-basic"
                          />

                          <Dropdown.Menu>
                            <Dropdown.Item
                              href="#/action-1"
                              onClick={() => setSortCategory("Latest Activity")}
                            >
                              Latest Activity
                            </Dropdown.Item>
                            <Dropdown.Item
                              href="#/action-2"
                              onClick={() => setSortCategory("Most Comment")}
                            >
                              Most Comment
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="forum-content-wrapper mt-3">
                      <div
                        className="card"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                      >
                        {categoryChosen === "All Discussions" ? (
                          <>
                            <div
                              className="card-body"
                              style={{ height: "520px" }}
                            >
                              {currentForum.map((data, index) => (
                                <div
                                  className="forum-list-container"
                                  key={index}
                                >
                                  <div className="left d-flex">
                                    <img
                                      className="img-fluid"
                                      src={`assets/coin.png`}
                                      alt=""
                                      style={{ height: "50px" }}
                                    />
                                    <div className="forum-list-title ms-4">
                                      <p className="m-0">{data.title}</p>
                                      <span>{data.createdDate.toString()}</span>
                                    </div>
                                  </div>
                                  <div className="right">
                                    <span className="badge badge-outlined text-white me-2">
                                      {data.questionCategory}
                                    </span>
                                    <span className="badge badge-outlined text-white me-2">
                                      {data.questionLevel}
                                    </span>
                                    <BiComment />
                                    <span>{data.totalComment}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <Pagination
                              totalClass={forumList.forum_list.length}
                              classPerPage={classPerPage}
                              onPageChange={handlePageChange}
                              currentPage={currentPage}
                            />
                          </>
                        ) : (
                          <>
                            <div
                              className="card-body"
                              style={{ height: "520px" }}
                            >
                              {currentForum.map((data, index) => {
                                if (data.questionCategory === categoryChosen) {
                                  return (
                                    <div
                                      className="forum-list-container"
                                      key={index}
                                    >
                                      <div className="left d-flex">
                                        <img
                                          className="img-fluid"
                                          src={`assets/coin.png`}
                                          alt=""
                                          style={{ height: "50px" }}
                                        />
                                        <div className="forum-list-title ms-4">
                                          <p className="m-0">{data.title}</p>
                                          <span>
                                            {data.createdDate.toString()}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="right">
                                        <span className="badge badge-outlined text-white me-2">
                                          {data.questionCategory}
                                        </span>
                                        <span className="badge badge-outlined text-white me-2">
                                          {data.questionLevel}
                                        </span>
                                        <BiComment />
                                        <span>{data.totalComment}</span>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                            <Pagination
                              totalClass={handleCategoryChosenForum(
                                categoryChosen
                              )}
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
              <div
                className="col-2"
                style={{
                  overflow: "scroll",
                  overflowX: "hidden",
                }}
              >
                <div className="card mb-3" style={{ height: "95vh" }}>
                  <div
                    className="card-body"
                    style={{
                      backgroundColor: "#11235A",
                      borderRadius: "0.375rem",
                    }}
                  >
                    <div className="card-text" style={{ color: "#fff" }}>
                      <p>
                        <button
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
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  color: "white",
                                }}
                                key={index}
                                onClick={() =>
                                  setCategoryChosen(category.categoryName)
                                }
                              >
                                {category.categoryName}
                              </button>
                            </p>
                          );
                        } else {
                          return (
                            <p>
                              <button
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  color: "white",
                                }}
                                key={index}
                                onClick={() =>
                                  setCategoryChosen(category.categoryName)
                                }
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
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Forum;
