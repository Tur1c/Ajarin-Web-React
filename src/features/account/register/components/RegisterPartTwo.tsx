import { useState } from "react";
import axios from "../../../../api/axios";
import { AccountRegisterSchema } from "../../../../model/Account";
import "./RegisterPartTwo.css";

const REGISTER_URL = "/api/account/register";

function RegisterPartTwo( props:any ) {
  
  const [accountRegister, setAccountRegister] = useState({ ...props.data });
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify(accountRegister),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      if (response.data.errorSchema.message = "Sukses") {
        props.callBack(response.data.errorSchema.message)
      }
      
    } catch (err) {
      // if (!err?.response) {
      //   console.log("No Server Response");
        
      // }
      console.log(err);
    }
  };

  return (
      <div className="wrapper d-flex">
        <div className="flex-fill">
          <form onSubmit={handleSubmit}>
            <h1 className="text fw-bold">One More Step.</h1>
            <div className="text register-link">
              Before you’ll start learning, let us know about you first
            </div>

            <div className="inputs d-flex" style={{ width: "100%" }}>
              <div className="mb-5 me-5">
                <div className="d-flex mx-auto">
                  <div className="input-box" style={{ marginBottom: "0.5rem" }}>
                    <input
                      type="number"
                      required
                      style={{ width: "100%" }}
                      id="age"
                      onChange={(e) =>
                        setAccountRegister({
                          ...accountRegister,
                          age: e.target.valueAsNumber,
                        })
                      }
                    />
                    <label>Age</label>
                  </div>
                  <div className="input-box" style={{ marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      required
                      style={{ width: "100%" }}
                      id="gender"
                      onChange={(e) =>
                        setAccountRegister({
                          ...accountRegister,
                          gender: e.target.value,
                        })
                      }
                    />
                    <label>Gender</label>
                  </div>
                </div>

                <div className="input-box">
                  <input
                    type="text"
                    required
                    id="phoneNumber"
                    onChange={(e) =>
                      setAccountRegister({
                        ...accountRegister,
                        phoneNumber: e.target.value,
                      })
                    }
                  />
                  <label>Phone Number</label>
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    required
                    id="education"
                    onChange={(e) =>
                      setAccountRegister({
                        ...accountRegister,
                        education: e.target.value,
                      })
                    }
                  />
                  <label>Education Level</label>
                </div>
              </div>

              <div className="mb-5">
                <div className="input-box">
                  <input
                    type="text"
                    required
                    id="city"
                    onChange={(e) =>
                      setAccountRegister({
                        ...accountRegister,
                        city: e.target.value,
                      })
                    }
                  />
                  <label>City</label>
                </div>

                <div className="input-box">
                  <input
                    type="text"
                    required
                    id="country"
                    onChange={(e) =>
                      setAccountRegister({
                        ...accountRegister,
                        country: e.target.value,
                      })
                    }
                  />
                  <label>Country</label>
                </div>
                <div className="input-box">
                  <input
                    type="text"
                    required
                    id="school"
                    onChange={(e) =>
                      setAccountRegister({
                        ...accountRegister,
                        school: e.target.value,
                      })
                    }
                  />
                  <label>School/Works at</label>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <button type="submit" className="fw-bold">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>

    
  );
}

export default RegisterPartTwo;
