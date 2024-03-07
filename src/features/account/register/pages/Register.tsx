import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../../shared/navbar/Navbar";
import createAcc from "../Create Account.png";
import RegisterPartTwo from "../components/RegisterPartTwo";
import "./Register.css";
import { AccountRegisterSchema } from "../../../../model/Account";
import RegisterSuccess from "../components/RegisterSuccess";
import { DiscussionListOutput, DiscussionListSchema } from "../../../../model/course/course-list";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Register() {
  const [pageState, setPageState] = useState(0);

  const [accountRegister, setAccountRegister] = useState<AccountRegisterSchema>({
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
    pic_url: ""
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const checkPwd = PWD_REGEX.test(pwd);
    if (!checkPwd) {
      setErrMsg("Invalid Entry");
      return;
    }

    setAccountRegister((accountRegister) => ({
      ...accountRegister,
      password: pwd,
    }));
    
    setPageState(1);
  };

  function callBack(data: string){
    setSuccess(data);
  };

  return (
    !success ? (
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
            <div className="wrapper d-flex">
              <div className="flex-fill">
                <form onSubmit={handleSubmit}>
                  <h1 className="text fw-bold">Create new account.</h1>
                  <div className="text register-link">
                    Already Have Account?{" "}
                    <Link
                      to="/login"
                      style={{ color: "#F6ECA9", textDecoration: "none" }}
                    >
                      <b>Log In</b>
                    </Link>
                  </div>
                  <div className="inputs">
                    <div className="mb-5">
                      <div className="d-flex mx-auto">
                        <div
                          className="input-box"
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
                          className="input-box"
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
                        Must include uppercase and lowercase letters, a number,
                        and a special character. <br />
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
                          matchFocus && !validMatch ? "instructions" : "offscreen"
                        }
                      >
                        Must match the first password input field. <br />
                      </p>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
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
              <div className="img-learning flex-fill">
                <img
                  src={createAcc}
                  alt="Learning png"
                  style={{
                    height: 389,
                    width: 583,
                  }}
                />
              </div>
            </div>
          ) : (
            <RegisterPartTwo callBack={callBack} data={accountRegister} />
          )}
        </section>
      </Navbar>
    )
    :
    (
      <RegisterSuccess />
    )
  );
}

export default Register;
