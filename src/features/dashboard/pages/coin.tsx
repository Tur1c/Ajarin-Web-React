import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import {
  AccountOutput,
  AccountSchema,
  transfromToAccountOutput,
} from "../../../model/Account";
import { ApiResponse } from "../../../model/schema/base_schema";
import "./coin.css";

const UPDATE_URL = "/api/account/";

function Coin() {
  const navigate = useNavigate();
  const { state } = useLocation();

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
        price: "50000",
        value: "50",
      },
      {
        price: "100000",
        value: "120",
      },
      {
        price: "150000",
        value: "180",
      },
      {
        price: "250000",
        value: "270",
      },
      {
        price: "350000",
        value: "380",
      },
      {
        price: "500000",
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
  });

  const [test, setTest] = useState({
    fname: "",
    lname: "",
  });

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

  const handleTopup = (value: string, price: string) => {
    topupCoin(value, price);
    setTimeout(() => {
      navigate("/");
    }, 500);
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
                onClick={() => navigate(-1)}
              />
            </div>
            <div className="logo-ajarin" style={{ cursor: "default" }}>
              <h1
                className="fw-bold"
                style={{ color: "#fff", fontSize: "36px" }}
              >
                ajar
                <span style={{ color: "#F6ECA9", fontSize: "36px" }}>in</span>
              </h1>
            </div>
          </div>
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
                      onClick={() => handleTopup(data.value, data.price)}
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
        </div>
      </div>
    </>
  );
}

export default Coin;
