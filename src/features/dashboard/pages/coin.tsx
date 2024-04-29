import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../../../api/axios";
import {
  AccountOutput,
  AccountSchema,
  transfromToAccountOutput,
} from "../../../model/Account";
import { ApiResponse } from "../../../model/schema/base_schema";
import "./coin.css";

const UPDATE_URL = "/api/account/";
const WITHDRAW_URL = "/api/account/";
const MIDTRANS_URL = "/api/payment";

declare global {
  interface Window {
    snap: any;
  }
}

function Coin() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const userRole = sessionStorage.getItem("role");

  console.log(state);

  const [coin, setCoin] = useState({
    coins: [
      {
        price: "15000",
        value: "10",
      },
      {
        price: "25000",
        value: "20",
      },
      {
        price: "70000",
        value: "50",
      },
      {
        price: "160000",
        value: "120",
      },
      {
        price: "240000",
        value: "180",
      },
      {
        price: "330000",
        value: "270",
      },
      {
        price: "480000",
        value: "380",
      },
      {
        price: "600000",
        value: "450",
      },
    ],
  });

  const [account, setAccount] = useState<AccountOutput>({
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    age: 0,
    gender: "",
    phoneNumber: "",
    education: "",
    city: "",
    country: "",
    school: "",
    id: "",
    coin: 0,
    studentdisc_list: [],
    studentcourse_list: [],
    subscribed_lecturer: [],
    urlImage: "",
    notification: [],
  });

  const [test, setTest] = useState({
    fname: "",
    lname: "",
  });

  let coinWithdraw: string;

  const topupCoin = async (value: string, price: string) => {
    let topupAccount = { ...account, coin: account.coin + parseInt(value) };
    try {
      const response = await axios.put<ApiResponse<AccountSchema>>(
        UPDATE_URL + account.id,
        JSON.stringify(topupAccount),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      setAccount(transfromToAccountOutput(response.data.outputSchema));
    } catch {}
  };

  const withdrawCoin = async () => {
    console.log("masok");
    if (state.teacher.user.coin - parseInt(coinWithdraw) < 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Coin to withdraw not enough",
        background: "#11235a",
        color: "#fff",
        confirmButtonColor: "#f6e976",
        confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
      });
      return;
    }
    try {
      const response = await axios.put<ApiResponse<AccountSchema>>(
        WITHDRAW_URL + state.teacher.user.id + "/" + coinWithdraw,
        null,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success Withdraw " + coinWithdraw + " coins",
        background: "#11235a",
        color: "#fff",
        confirmButtonColor: "#f6e976",
        confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
      }).then(function () {
        navigate("/");
      });
    } catch {}
  };

  const handleWithdrawCoin = () => {
    withdrawCoin();
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handleTopup = (value: string, price: string) => {
    topupCoin(value, price);
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handlePayment = async (value: string, price: string) => {
    let formData = new FormData();
    formData.append("price", price);

    try {
      const response = await axios.post(MIDTRANS_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        withCredentials: true,
      });
      console.log(response);
      window.snap.pay(response.data, {
        onSuccess: () => {
          handleTopup(value, price);
        },
        onError: (error: any) => {
          console.log(error);
        },
        onClose: () => {
          console.log("Kamu belum menyelesaikan pembayaran!");
        },
      });
    } catch {}
  };

  useEffect(() => {
    setAccount((account) => ({
      ...state,
    }));
  }, []);

  return (
    <>
      <div className="coin-container">
        <div className="coin-body">
          <div className="coin-top d-flex row">
            <div className="close">
              <IoIosCloseCircleOutline
                style={{ fontSize: "48px" }}
                onClick={() => navigate("/")}
              />
            </div>
            <div
              className="logo-ajarin"
              style={{ cursor: "default", width: "60%" }}
            >
              <h1
                className="fw-bold"
                style={{ color: "#fff", fontSize: "36px" }}
              >
                ajar
                <span style={{ color: "#F6ECA9", fontSize: "36px" }}>in</span>
              </h1>
            </div>
          </div>
          {userRole === "Teacher" ? (
            <div className="teacher-coin-container">
              <div className="text-center mt-5">
                <h1
                  className="text-white fw-bold "
                  style={{ fontSize: "3rem" }}
                >
                  Enter Your Withdrawal Detail
                </h1>
                <div className="inputs">
                  <div className="d-flex row">
                    <div
                      className="input-box-name col-6"
                      style={{ marginBottom: "0.5rem", width: "50%" }}
                    >
                      <input
                        type="text"
                        required
                        style={{ width: "100%" }}
                        id="accountNumber"
                      />
                      <label style={{ marginLeft: "12px" }}>
                        Account Number
                      </label>
                    </div>
                    <div
                      className="d-flex justify-content-end col-6"
                      style={{
                        backgroundColor: "#596FB7",
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        textDecoration: "none",
                      }}
                    >
                      <h3
                        className="text-white pt-2"
                        style={{ fontSize: "24px", textAlign: "center" }}
                      >
                        Available Coins
                      </h3>
                      <img
                        src={`assets/coin.png`}
                        alt="abc"
                        style={{ height: "36px" }}
                      />
                      <span
                        style={{
                          fontSize: "36px",
                          fontWeight: "bolder",
                          color: "var(--yelo)",
                          letterSpacing: "1px",
                        }}
                      >
                        {state.teacher.user.coin}
                      </span>
                    </div>
                  </div>
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
                          id="accountName"
                        />
                        <label>Account Name</label>
                      </div>
                      <div
                        className="input-box-name"
                        style={{ marginBottom: "0.5rem" }}
                      >
                        <input
                          type="text"
                          required
                          style={{ width: "100%" }}
                          id="withdrawAmount"
                          onChange={(e) => {
                            coinWithdraw = e.target.value;
                          }}
                        />
                        <label>
                          Withdraw Amount ( One Coin will be Converted into IDR
                          1000,00)
                        </label>
                      </div>
                    </div>
                  </div>
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
                          id="paymentMethod"
                        />

                        <label>Payment Method</label>
                      </div>
                      <div
                        className="input-box-name"
                        style={{ marginBottom: "0.5rem" }}
                      >
                        <input
                          type="hidden"
                          required
                          style={{ width: "100%" }}
                          id="firstName"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 d-flex justify-content-between align-items-center">
                  <button
                    className="fw-bold"
                    onClick={() => {
                      withdrawCoin();
                    }}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="coin-content h-100">
              <div className="text-end d-flex justify-content-end">
                <div
                  className="button-coin-detail d-flex justify-content-end"
                  style={{
                    backgroundColor: "#596FB7",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <h3
                    className="text-white pt-2"
                    style={{ fontSize: "24px", textAlign: "center" }}
                  >
                    Available Coins
                  </h3>
                  <img
                    src={`assets/coin.png`}
                    alt="abc"
                    style={{ height: "36px" }}
                  />
                  <span
                    style={{
                      fontSize: "36px",
                      fontWeight: "bolder",
                      color: "var(--yelo)",
                      letterSpacing: "1px",
                    }}
                  >
                    {account.coin}
                  </span>
                </div>
              </div>

              <div
                className="d-flex  justify-content-center"
                style={{ marginTop: "1rem" }}
              >
                <div className="card-list">
                  {coin.coins.map((data, index) => (
                    <div
                      className=" p-3 m-0 "
                      style={{ marginBottom: "2rem" }}
                      key={index}
                    >
                      <div
                        className="coin-card card"
                        onClick={() => {
                          // handleTopup(data.value, data.price);
                          handlePayment(data.value, data.price);
                        }}
                      >
                        <div className="card-body">
                          <div className="class-content  text-center">
                            <div className="class" style={{ width: "10rem" }}>
                              <div className="" style={{ width: "100%" }}>
                                <img
                                  src={`assets/coin.png`}
                                  alt="abc"
                                  className=""
                                  style={{ height: "48px" }}
                                />
                                <div className="d-flex row">
                                  <div className="title-class">
                                    <h1
                                      style={{
                                        color: "#C6CF9B",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {data.value}
                                    </h1>
                                    <p
                                      style={{
                                        fontSize: "24px",
                                        fontWeight: "600",
                                        color: "var(--blue)",
                                      }}
                                    >
                                      IDR. {data.price}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Coin;
