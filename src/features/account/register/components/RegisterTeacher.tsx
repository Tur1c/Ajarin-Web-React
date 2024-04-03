import { ChangeEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../../api/axios";
import {
  AccountSchema,
  TeacherRegisterSchema,
} from "../../../../model/Account";
import { ApiResponse } from "../../../../model/schema/base_schema";
import "./RegisterTeacher.css";

const REGISTER_TEACHER = "/api/account/register/teacher";

function RegisterTeacher() {
  const { state } = useLocation();
  console.log("dapet apa aja", state);

  const [image, setImage] = useState<File>();
  const navigate = useNavigate();

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

    formData.append("email", state.account.email);
    if (image) {
      formData.append("file", image);
    }

    formData.append("education", accountRegister.education);
    formData.append("experience", accountRegister.experience);
    formData.append("achievement", accountRegister.achievement);
    formData.append("profile_description", accountRegister.profile_description);

    try {
      const response = await axios.post<ApiResponse<AccountSchema>>(
        REGISTER_TEACHER,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      navigate("/");
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

  return (
    <div className="register-teacher-container">
      <div className="p-5 text-light">
        <div className="ajarin-logo">
          <h1 className="fw-bold" style={{ color: "#fff", fontSize: "48px",marginBottom: "3rem" }}>
            ajar<span style={{ color: "#F6ECA9" }}>in</span>
          </h1>
        </div>
        <div className="input-container">
          <h1
            className="text fw-bold"
            style={{ marginBottom: "3rem", fontSize: "60px" }}
          >
            Let the Worlds know About You.
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="inputs">
              <div className="">
                <div className="input-box-textarea">
                  <textarea
                    className="scrollable"
                    required
                    id="description"
                    onChange={(e) =>
                      setAccountRegister({
                        ...accountRegister,
                        profile_description: e.target.value,
                      })
                    }
                  />
                  <label>Describe About You</label>
                </div>
                <div className="input-box-teach">
                  <input
                    type="text"
                    required
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

                <div className="input-box-teach">
                  <input
                    type="text"
                    required
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
                <div className="input-box-teach">
                  <input
                    type="text"
                    required
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

              <div className="upload-cv d-flex row">
                <label>Upload Your CV Image</label>

                <input
                  type="file"
                  required
                  id="cv"
                  onChange={handleImageChange}
                  accept="application/pdf"
                />
              </div>

              <div className="upload-btn d-flex justify-content-between align-items-center">
                <button type="submit" className="fw-bold">
                  Create Account
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterTeacher;
