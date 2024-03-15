import { ChangeEvent, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { AccountSchema } from "../../../model/Account";
import { AddDiscussionSchema } from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import "./teacher-modal-add-discussion.css";

const ADD_DISCUSSION = "/api/discussion/add";

function TeacherModalAddDiscussion(props: any) {
  const [addDiscussion, setAddDiscussion] = useState<AddDiscussionSchema>({
    category: "",
    description: "",
    education_level: "",
    end_date: new Date(),
    link: "",
    max_participant: "",
    price: "",
    start_date: new Date(),
    title: "",
    user_id: 0,
  });
  const navigate = useNavigate();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [image, setImage] = useState<File>();

  const handleStartDateChange = (date: any) => {
    setSelectedStartDate(date);
    setAddDiscussion({
      ...addDiscussion,
      start_date: date,
    });
  };

  const handleEndDateChange = (date: any) => {
    setSelectedEndDate(date);
    setAddDiscussion({
      ...addDiscussion,
      end_date: date,
    });
  };

  const handleAddDiscussionFile = () => {
    setPage(2);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files;
    console.log(file);
    if (file) {
      setImage(file[0]);
    }
  };

  function toISOLocal(d: Date) {
    const Y = d.getFullYear();
    const m = d.getMonth() + 1;
    const D = d.getDate();
    const H = d.getHours();
    const M = d.getMinutes();

    const s = Y + "-" + m + "-" + D + "T" + H + ":" + M;
    return s;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData = new FormData();
    let file;

    console.log(toISOLocal(addDiscussion.start_date));

    formData.append("title", addDiscussion.title);
    formData.append("category", addDiscussion.category);
    formData.append("education_level", addDiscussion.education_level);
    formData.append("description", addDiscussion.description);
    formData.append("start_date", toISOLocal(addDiscussion.start_date));
    formData.append("end_date", toISOLocal(addDiscussion.end_date));
    formData.append("max_participant", addDiscussion.max_participant);
    formData.append("price", addDiscussion.price);
    formData.append("link", addDiscussion.link);
    formData.append("user_id", "1");
    if (image) {
      formData.append("file", image);
    }

    // try {
    //   let imageURL;
    //   const imageFormData = new FormData();
    //   if(image) imageFormData.append("file", image);
    //   imageFormData.append("cloud_name", "de3swhffe");
    //   imageFormData.append("upload_preset", "ez9c4ucn");

    //   const response = await fetch(
    //     "https://api.cloudinary.com/v1_1/de3swhffe/image/upload",
    //     {
    //       method: "post",
    //       body: imageFormData
    //     }
    //   );
    //   const imgData = await response.json();
    //   alert(imgData.url.toString());
    // } catch {

    // }

    try {
      const response = await axios.post<ApiResponse<AccountSchema>>(
        ADD_DISCUSSION,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      setPage(1);
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setPage(1);
  }, []);

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="p-0 d-block">
        <div
          className="container-class-header d-flex justify-content-around mt-3"
          style={{ height: "2rem" }}
        >
          <div>
            <IoIosCloseCircleOutline
              style={{ color: "#fff", fontSize: "54px" }}
              onClick={props.onHide}
            />
          </div>
          <div style={{ fontSize: "30px" }}>
            <span>Set Discussion</span>
          </div>
          <div></div>
        </div>
      </Modal.Header>
      <Modal.Body className="p-5">
        <div className="modal-body-container">
          <form onSubmit={handleSubmit}>
            {page === 1 ? (
              <div className="inputs" style={{ width: "100%" }}>
                <div className="">
                  <div className="input-box" style={{ marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      required
                      style={{ width: "100%" }}
                      id="discussion-title"
                      onChange={(e) =>
                        setAddDiscussion({
                          ...addDiscussion,
                          title: e.target.value,
                        })
                      }
                    />
                    <label>Discussion Title</label>
                  </div>
                  <div className="input-box" style={{ marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      required
                      style={{ width: "100%" }}
                      id="subject"
                      onChange={(e) =>
                        setAddDiscussion({
                          ...addDiscussion,
                          category: e.target.value,
                        })
                      }
                    />
                    <label>Subject</label>
                  </div>

                  <div className="input-box" style={{ marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      required
                      style={{ width: "100%" }}
                      id="education-level"
                      onChange={(e) =>
                        setAddDiscussion({
                          ...addDiscussion,
                          education_level: e.target.value,
                        })
                      }
                    />
                    <label>Education Level</label>
                  </div>

                  <div className="input-box">
                    <textarea
                      className=""
                      required
                      style={{ width: "100%" }}
                      id="description"
                      onChange={(e) =>
                        setAddDiscussion({
                          ...addDiscussion,
                          description: e.target.value,
                        })
                      }
                    />
                    <label>Description</label>
                  </div>
                  <div className="input-box">
                    <DatePicker
                      selected={selectedStartDate}
                      onChange={handleStartDateChange}
                      showTimeSelect
                      dateFormat="yyyy-MM-dd hh:mm a"
                    ></DatePicker>
                  </div>
                  <div className="input-box">
                    {/* <input type="text" required id="end-date" /> */}
                    <DatePicker
                      selected={selectedEndDate}
                      onChange={handleEndDateChange}
                      showTimeSelect
                      dateFormat="yyyy-MM-dd hh:mm a"
                    ></DatePicker>
                  </div>
                  <div className="input-box">
                    <input
                      type="text"
                      required
                      id="max-participant"
                      onChange={(e) =>
                        setAddDiscussion({
                          ...addDiscussion,
                          max_participant: e.target.value,
                        })
                      }
                    />
                    <label>Max Participant</label>
                  </div>
                  <div className="input-box">
                    <input
                      type="text"
                      required
                      id="price"
                      onChange={(e) =>
                        setAddDiscussion({
                          ...addDiscussion,
                          price: e.target.value,
                        })
                      }
                    />
                    <label>
                      <img
                        className="img-fluid"
                        style={{
                          width: "36px",
                          height: "36px",
                        }}
                        src={`assets/coin.png`}
                        alt=""
                      />
                      Coin Price
                    </label>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <button
                    className="fw-bold"
                    onClick={() => handleAddDiscussionFile()}
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="inputs" style={{ width: "100%" }}>
                <div className="input-box" style={{ marginBottom: "0.5rem" }}>
                  <input
                    type="text"
                    required
                    style={{ width: "100%" }}
                    id="url"
                    onChange={(e) =>
                      setAddDiscussion({
                        ...addDiscussion,
                        link: e.target.value,
                      })
                    }
                  />
                  <label>Subject</label>
                </div>
                <div className="">
                  {image ? (
                    <div className="text-center">
                      <img
                        className="img-fluid mb-4"
                        src={URL.createObjectURL(image)}
                        alt=""
                        style={{ height: "20rem" }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "20rem",
                        background: "rgba(0, 0, 0, 0.2)",
                      }}
                    ></div>
                  )}
                </div>
                <label className="btn btn-default">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
                <div className="d-flex justify-content-between align-items-center mt-5">
                  <button
                    type="submit"
                    className="fw-bold"
                    onClick={() => {
                      props.onHide();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer className="p-0">
        <div
          className="modal-footer-center"
          style={{
            backgroundColor: "#11235a",
            fontSize: "20px",
            width: "100%",
            height: "75px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p onClick={props.onHide} className="text-white"></p>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default TeacherModalAddDiscussion;
