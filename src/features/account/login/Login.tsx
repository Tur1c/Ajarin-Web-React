import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AccountLoginSchema } from "../../../model/Account";
import Navbar from "../../../shared/navbar/Navbar";
import learningImg from "./Learning 1.png";
import "./Login.css";
import AuthContext from "../../../context/AuthProvider";
import axios from "../../../api/axios";
import { ApiResponse } from "../../../model/schema/base_schema";
import { transfromToServiceLoginAccountOutput } from "../../../service/Account/account.service";
import { AxiosError } from "axios";

const LOGIN_URL = "/api/account/login";

function Login() {
  const { setAuth }: any = useContext(AuthContext);

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [accountLogin, setAccountLogin] = useState<AccountLoginSchema>({
    email: "",
    password: "",
  });

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current?.focus();
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
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      // setAuth({ accountLogin, accessToken, roles });
      console.log(transfromToServiceLoginAccountOutput(response.data));
      
    } catch (error) {
      if(error instanceof AxiosError) {
        console.log(error?.response?.data.errorSchema);
      }
      
    }
  };

  return (
    <section>
      <Navbar>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <div className="wrapper d-flex">
          <div className="flex-fill">
            <form onSubmit={handleSubmit}>
              <h1 className="text fw-bold">Log In to Your Account.</h1>
              <div className="text register-link">
                Don't have account yet?{" "}
                <Link
                  to="/register"
                  style={{ color: "#F6ECA9", textDecoration: "none" }}
                >
                  <b>Sign Up Now.</b>
                </Link>
              </div>
              <div className="inputs">
                <div className="mb-5">
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
                </div>

                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ width: "70%" }}
                >
                  <div className="forgot">
                    <a href="#" className="fw-bold">
                      Forgot Password?
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
                height: 389,
                width: 583,
              }}
            />
          </div>
        </div>
      </Navbar>
    </section>
  );
}

export default Login;
