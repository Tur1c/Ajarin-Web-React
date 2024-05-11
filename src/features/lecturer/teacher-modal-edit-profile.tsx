import { ChangeEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { TeacherRegisterSchema } from "../../model/Account";
import { ApiResponse } from "../../model/schema/base_schema";
import {
  Teacher,
  transformToTeacherOutput,
} from "../../model/teacher/teacher-model";
import "./teacher-modal-edit-profile.css";
import Swal from "sweetalert2";

const EDIT_PROFILE = "/api/account/teacher/update/";

function TeacherModalEditProfile(props: any) {
  const navigate = useNavigate();
  const [image, setImage] = useState<File>();
  console.log(props);

  const [accountRegister, setAccountRegister] = useState<TeacherRegisterSchema>(
    {
      profile_description: "",
      achievement: "",
      education: "",
      experience: "",
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let formData = new FormData();
    let file;

    if (image) {
      formData.append("file", image);
    }

    formData.append("education", accountRegister.education);
    formData.append("experience", accountRegister.experience);
    formData.append("achievement", accountRegister.achievement);
    formData.append("profile_description", accountRegister.profile_description);

    try {
      const response = await axios.put<ApiResponse<Teacher>>(
        EDIT_PROFILE + props.teacher.id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      console.log(response, "response ni");

      Swal.fire({
        title: "Success Update Profile",
        icon: "success",
        background: "#11235a",
        color: "#fff",
        confirmButtonColor: "#f6e976",
        confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
      }).then(function () {
        navigate(
          "/lecturer/" +
            response.data.outputSchema.user.firstName +
            " " +
            response.data.outputSchema.user.lastName,
          {
            state: {
              data: transformToTeacherOutput(response.data.outputSchema),
            },
          }
        );
        props.onHide();
        props.loadingSuccess();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files;
    console.log(file);
    if (file) {
      setImage(file[0]);
    }
  };

  useEffect(() => {
    setAccountRegister({
      profile_description: "",
      achievement: "",
      education: "",
      experience: "",
    });
  }, [props.onHide]);

  return (
    <>
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        centered
        className="h-100"
      >
        <Modal.Header className="d-flex w-100" style={{ border: "none" }}>
          <div className="edit-profile-header container-class-header d-flex col justify-content-between mt-3">
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
              <span>Edit Profile</span>
            </div>
            <div></div>
          </div>
        </Modal.Header>
        <Modal.Body
          className="edit-profile-body h-100"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="modal-body-container w-100 h-100 mt-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <div className="inputs">
                <div className="">
                  <div
                    className="input-box-textarea"
                    style={{ marginBottom: "2rem" }}
                  >
                    <textarea
                      className="scrollable"
                      id="description"
                      placeholder="Describe About You"
                      onChange={(e) =>
                        setAccountRegister({
                          ...accountRegister,
                          profile_description: e.target.value,
                        })
                      }
                    />
                    <label>Describe About You</label>
                  </div>
                  <div
                    className="input-box-teach"
                    style={{ marginBottom: "2rem" }}
                  >
                    <input
                      type="text"
                      style={{ width: "100%" }}
                      id="education"
                      onChange={(e) =>
                        setAccountRegister({
                          ...accountRegister,
                          education: e.target.value,
                        })
                      }
                    />
                    <label>Add Your Education History</label>
                  </div>

                  <div
                    className="input-box-teach"
                    style={{ marginBottom: "2rem" }}
                  >
                    <input
                      type="text"
                      id="experience"
                      onChange={(e) =>
                        setAccountRegister({
                          ...accountRegister,
                          experience: e.target.value,
                        })
                      }
                    />
                    <label>Add Your Experience</label>
                  </div>
                  <div
                    className="input-box-teach"
                    style={{ marginBottom: "2rem" }}
                  >
                    <input
                      type="text"
                      id="education"
                      onChange={(e) =>
                        setAccountRegister({
                          ...accountRegister,
                          achievement: e.target.value,
                        })
                      }
                    />
                    <label>Add Your Acheivement</label>
                  </div>
                </div>

                <div
                  className="upload-cv d-flex row text-white"
                  style={{ marginBottom: "2rem" }}
                >
                  <label
                    className="btn btn-default text-light d-flex justify-content-center w-25"
                    style={{
                      backgroundColor: "var(--lightblue2",
                      marginLeft: "0.7rem",
                    }}
                  >
                    Upload Your CV Image
                    <input
                      type="file"
                      id="cv"
                      onChange={handleImageChange}
                      accept="application/pdf"
                      className="inputfile"
                    />
                  </label>
                </div>

                <div className="next-btn d-flex justify-content-center align-items-center">
                  <button
                    type="submit"
                    className="fw-bold"
                    // onClick={() => handleAddDiscussionFile()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TeacherModalEditProfile;
