import { ChangeEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  console.log(state);

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
    <div className="wrapper">
      <div className="flex-fill">
        <form onSubmit={handleSubmit}>
          <h1 className="text fw-bold">Let the Worlds know About You.</h1>

          <div className="inputs" style={{ width: "100%" }}>
            <div className="mb-5 me-5">
              <div className="input-box" style={{ marginBottom: "0.5rem" }}>
                <textarea
                  className=""
                  required
                  style={{ width: "100%" }}
                  id="description"
                  onChange={(e) =>
                    setAccountRegister({
                      ...accountRegister,
                      profile_description: e.target.value,
                    })
                  }
                />
                <label>Profile Description</label>
              </div>
              <div className="input-box" style={{ marginBottom: "0.5rem" }}>
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

              <div className="input-box">
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
              <div className="input-box">
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

            <div className="mb-5">
              <div className="mb-5">
                <div className="input-box">
                  <input
                    type="file"
                    required
                    id="cv"
                    onChange={handleImageChange}
                    accept="application/pdf"
                  />
                  <label>Upload Your CV Image</label>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button type="submit" className="fw-bold">
                Create Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterTeacher;
