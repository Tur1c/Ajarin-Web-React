import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { useAuth } from "../../../context/AuthProvider";
import { AccountLoginSchema } from "../../../model/Account";
import { ApiResponse } from "../../../model/schema/base_schema";
import { transfromToServiceLoginAccountOutput } from "../../../service/Account/account.service";
import Navbar from "../../../shared/navbar/Navbar";
import learningImg from "./Learning 1.png";
import "./Login.css";

const LOGIN_URL = "/api/account/login";

function Login() {
  const { login }: any = useAuth();

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [accountLogin, setAccountLogin] = useState<AccountLoginSchema>({
    email: "",
    password: "",
    token: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current?.focus();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post<ApiResponse<AccountLoginSchema>>(
        LOGIN_URL,
        JSON.stringify(accountLogin),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const output = transfromToServiceLoginAccountOutput(response.data);
      const token = output.token;
      await login({ accountLogin, token });
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.data.errorSchema);
      }
      setErrMsg("Wrong email or password! Please try again");
    }
  };

  return (
    <section>
      {!isLoading ? (
        <Navbar>
          <div className="login-wrapper d-flex bg-dar">
            <div className="login-input">
              <form onSubmit={handleSubmit}>
                <h1 className="text fw-bold" style={{ cursor: "default" }}>
                  Log In to Your Account.
                </h1>
                <div>
                  Don't have account yet ?{" "}
                  <Link
                    to="/register"
                    className="register-link"
                    style={{ color: "#F6ECA9", textDecoration: "none" }}
                  >
                    <b>Sign Up Now.</b>
                  </Link>
                </div>
                <div className="inputs">
                  <div className="mb-4">
                    <div className="input-box">
                      <input
                        type="text"
                        required
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) =>
                          setAccountLogin({
                            ...accountLogin,
                            email: e.target.value,
                          })
                        }
                        value={accountLogin.email}
                      />
                      <label>Email Address</label>
                    </div>
                    <div className="input-box">
                      <input
                        type="password"
                        required
                        onChange={(e) =>
                          setAccountLogin({
                            ...accountLogin,
                            password: e.target.value,
                          })
                        }
                        value={accountLogin.password}
                      />
                      <label>Password</label>
                    </div>
                    <span
                      ref={errRef}
                      className={errMsg ? "fw-bold" : ""}
                      aria-live="assertive"
                      style={{ color: "#ff3d41" }}
                    >
                      {errMsg}
                    </span>
                  </div>
                  <div
                    className="w-100 d-flex justify-content-between align-items-center"
                    style={{ width: "70%" }}
                  >
                    <div className="forgot-password">
                      <a href="#" className="fw-bold">
                        
                      </a>
                    </div>

                    <button type="submit" className="fw-bold">
                      Log In
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="img-learning flex-fill">
              <img
                src={learningImg}
                alt="Learning png"
                style={{
                  height: "50vh",
                  marginLeft: "6rem",
                }}
              />
            </div>
          </div>
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
    </section>
  );
}

export default Login;
