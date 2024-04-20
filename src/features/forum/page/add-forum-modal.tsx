import Modal from "react-bootstrap/Modal";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  CategoryListOutput,
  CategorySchema,
  transfromToCategoryListOutput,
} from "../../../model/category/category-model";
import { AddForumSchema } from "../../../model/forum/forum-model";
import { ApiResponse } from "../../../model/schema/base_schema";
import "./add-forum-modal.css";

const ADD_FORUM_URL = "/api/forum/add";
const CATEGORY_URL = "/api/category";

function AddForumModal(props: any) {
  const isLogged = sessionStorage.getItem("jwt");
  const user = sessionStorage.getItem("user");
  const navigate = useNavigate();

  const [addForum, setAddForum] = useState<AddForumSchema>({
    question_title: "",
    question: "",
    question_category: "",
    question_level: "",
    user_email: "",
  });

  // console.log(addForum);

  interface eduOption {
    eduLevel: string;
    label: string;
  }

  const eduOptions: eduOption[] = [
    { eduLevel: "Education Level", label: "Education Level" },
    { eduLevel: "General", label: "General" },
    { eduLevel: "Highschool", label: "Highschool" },
    { eduLevel: "University", label: "University" },
  ];

  const [categories, setCategories] = useState<CategoryListOutput>({
    categories: [],
  });

  const [selectedEdu, setSelectedEdu] = useState<string>("");

  const handleChangeSubject = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEdu(event.target.value);
    setAddForum({ ...addForum, question_category: event.target.value });
  };

  const handleChangeEdu = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEdu(event.target.value);
    setAddForum({ ...addForum, question_level: event.target.value });
  };

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

  const handleSubmitForum = async (e: any) => {
    e.preventDefault();
    console.log("keluar apa2", addForum);
    try {
      const response = await axios.post(
        ADD_FORUM_URL,
        JSON.stringify(addForum),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      console.log("keluar apa", response);
      window.location.reload();
    } catch (error) {
      console.error("Error adding data: ", error);
      // window.location.reload();
    }
  };

  useEffect(() => {
    fetchCategoryData();
    setAddForum({ ...addForum, user_email: user });
  }, []);

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="d-flex w-100" style={{ border: "none" }}>
        <div
          className="container-class-header d-flex col justify-content-between mt-3"
          style={{ height: "2rem" }}
        >
          <div className="close-btn">
            <IoIosCloseCircleOutline
              style={{ color: "#fff", fontSize: "54px" }}
              onClick={props.onHide}
            />
          </div>
          <div
            className="d-flex pe-4"
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              cursor: "default",
            }}
          >
            <span>Add Forum</span>
          </div>
          <div></div>
        </div>
      </Modal.Header>
      <Modal.Body className="w-100">
        <div className="form-container">
          <form onSubmit={handleSubmitForum}>
            <div>
              <div className="input-boxx">
                <input
                  type="text"
                  required
                  style={{ width: "100%" }}
                  id="forum-title"
                  onChange={(e) =>
                    setAddForum({
                      ...addForum,
                      question_title: e.target.value,
                    })
                  }
                />
                <label>Title</label>
              </div>
              <div className="input-boxx">
                <textarea
                  className=""
                  required
                  style={{ width: "100%", height: "35vh" }}
                  placeholder="What's Your Thoughts"
                  id="description"
                  onChange={(e) =>
                    setAddForum({
                      ...addForum,
                      question: e.target.value,
                    })
                  }
                />
              </div>
              <div className="d-flex col">
                <div className="d-flex filter-container">
                  <select
                    className="filtering"
                    required
                    onChange={handleChangeSubject}
                  >
                    <option value="Subject">Subject</option>
                    {categories.categories.map((data) => {
                      return (
                        <>
                          <option value={data.categoryName}>
                            {data.categoryName}
                          </option>
                        </>
                      );
                    })}
                  </select>

                  <select
                    className="filtering"
                    required
                    value={selectedEdu}
                    onChange={handleChangeEdu}
                  >
                    {eduOptions.map((option) => (
                      <option key={option.eduLevel} value={option.eduLevel}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="buttons w-100">
              <button type="submit" className="post-btn fw-bold">
                Post
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddForumModal;
