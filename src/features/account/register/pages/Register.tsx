import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../../../../api/axios";
import { AccountRegisterSchema } from "../../../../model/Account";
import Navbar from "../../../../shared/navbar/Navbar";
import createAcc from "../Create Account.png";
import RegisterPartTwo from "../components/RegisterPartTwo";
import RegisterSuccess from "../components/RegisterSuccess";
import "./Register.css";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const EMAIL_CHECK = "/api/account/check-email/";

function Register() {
  const [pageState, setPageState] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [accountRegister, setAccountRegister] = useState<AccountRegisterSchema>(
    {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      age: 0,
      gender: "",
      phoneNumber: "",
      education: "",
      city: "",
      country: "",
      school: "",
      coin: 0,
      pic_name: "",
      pic_type: "",
      pic_url: "",
    }
  );

  const errRef = useRef<HTMLParagraphElement>(null);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [pwd, matchPwd]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const checkPwd = PWD_REGEX.test(pwd);
    if (!checkPwd) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const response = await axios.get(EMAIL_CHECK + accountRegister.email, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setAccountRegister((accountRegister) => ({
        ...accountRegister,
        password: pwd,
      }));

      setPageState(1);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response.data.errorSchema.message,
        background: "#11235a",
        color: "#fff",
        confirmButtonColor: "#f6e976",
        confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
      });
      // if (!err?.response) {
      //   console.log("No Server Response");

      // }
      console.log(err);
    }

    // setAccountRegister((accountRegister) => ({
    //   ...accountRegister,
    //   password: pwd,
    // }));

    // setPageState(1);
  };

  function callBack(data: string) {
    setSuccess(data);
  }

  return !success ? (
    <>
      {!isLoading ? (
        <Navbar>
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            {pageState === 0 ? (
              <div className="register-wrapper d-flex col">
                <div className="d-flex">
                  <form onSubmit={handleSubmit}>
                    <h1 className="text fw-bold">Create new account.</h1>
                    <div className="text register-link">
                      <p>Already Have Account ? </p>
                      <Link
                        to="/login"
                        className="login-link"
                        style={{ color: "#F6ECA9", textDecoration: "none" }}
                      >
                        <b>Log In</b>
                      </Link>
                    </div>
                    <div className="inputs">
                      <div className="mb-5">
                        <div className="d-flex">
                          <div className="naming">
                            <div
                              className="input-box-name"
                              style={{ marginBottom: "0.5rem" }}
                            >
                              <input
                                type="text"
                                required
                                style={{ width: "100%" }}
                                id="firstName"
                                onChange={(e) =>
                                  setAccountRegister({
                                    ...accountRegister,
                                    firstName: e.target.value,
                                  })
                                }
                              />
                              <label>First Name</label>
                            </div>
                            <div
                              className="input-box-name"
                              style={{ marginBottom: "0.5rem" }}
                            >
                              <input
                                type="text"
                                required
                                style={{ width: "100%" }}
                                id="lastName"
                                onChange={(e) =>
                                  setAccountRegister({
                                    ...accountRegister,
                                    lastName: e.target.value,
                                  })
                                }
                              />
                              <label>Last Name</label>
                            </div>
                          </div>
                        </div>

                        <div className="input-box">
                          <input
                            type="text"
                            required
                            id="email"
                            onChange={(e) =>
                              setAccountRegister({
                                ...accountRegister,
                                email: e.target.value,
                              })
                            }
                          />
                          <label>Email Address</label>
                        </div>
                        <div className="input-box">
                          <input
                            type="password"
                            required
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                          />
                          <label>Password</label>
                        </div>
                        <p
                          id="pwdnote"
                          className={
                            pwdFocus && !validPwd ? "instructions" : "offscreen"
                          }
                        >
                          8 to 24 characters. <br />
                          Must include uppercase and lowercase letters, a
                          number, and a special character. <br />
                        </p>
                        <div className="input-box">
                          <input
                            type="password"
                            required
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                          />
                          <label>Confirm Password</label>
                        </div>
                        <p
                          id="confirmnote"
                          className={
                            matchFocus && !validMatch
                              ? "instructions"
                              : "offscreen"
                          }
                        >
                          Must match the first password input field. <br />
                        </p>
                      </div>

                      <div className="create-btn d-flex justify-content-between align-items-center">
                        <button
                          type="submit"
                          className="fw-bold"
                          disabled={!validPwd || !validMatch ? true : false}
                        >
                          Create Account
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="img-learning d-flex ">
                  <img src={createAcc} alt="Learning png" />
                </div>
              </div>
            ) : (
              <RegisterPartTwo callBack={callBack} data={accountRegister} />
            )}
          </section>
        </Navbar>
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
  ) : (
    <RegisterSuccess />
  );
}

export default Register;
