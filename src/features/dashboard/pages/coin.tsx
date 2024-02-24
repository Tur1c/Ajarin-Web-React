import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./coin.css";

function Coin() {
  const navigate = useNavigate();

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

  return (
    <>
      <div className="coin-container">
        <div className="container p-5" style={{ height: "100vh" }}>
          <div className="d-block">
            <div className="row coin-header d-flex" style={{ width: "100%" }}>
              <div className="col-6">
                <IoIosCloseCircleOutline
                  style={{ color: "#fff", fontSize: "54px" }}
                  onClick={() => navigate("/")}
                />
              </div>
              <div
                className="logo_content col-6 mt-3"
                style={{ marginBottom: "30px" }}
              >
                <div className="logo">
                  <div className="logo_name">
                    <h1
                      className="fw-bold"
                      style={{ color: "#fff", fontSize: "22px" }}
                    >
                      ajar
                      <span style={{ color: "#F6ECA9" }}>in</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="coin-content">
              <div className="p-3">
                <div
                  className="text-end d-flex justify-content-end mb-3"
                  style={{}}
                >
                  <div
                    className="button-coin-detail p-2 d-flex justify-content-end"
                    style={{
                      backgroundColor: "#596FB7",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                    }}
                  >
                    <h3 className="me-3 mb-0 text-white">Available Coins</h3>{" "}
                    <img
                      src={`assets/coin.png`}
                      alt="abc"
                      style={{ height: "40px" }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div
                    className="card"
                    style={{ backgroundColor: "transparent", border: "none" }}
                  >
                    <div className="card-body p-0">
                      <div className="row ms-0">
                        {coin.coins.map((data, index) => (
                          <div
                            className="col-md-3 d-flex align-items-stretch mb-5"
                            key={index}
                          >
                            <div
                              className="card"
                              style={{
                                background: "rgba(255, 255, 255, 0.45)",
                              }}
                            >
                              <div className="card-body p-2">
                                <div className="card-text">
                                  <div className="class-content d-block text-center">
                                    <div
                                      className="class"
                                      style={{ width: "195px" }}
                                    >
                                      <div
                                        className=""
                                        style={{ width: "100%" }}
                                      >
                                        <img
                                          src={`assets/coin.png`}
                                          alt="abc"
                                          className="my-3"
                                          style={{ height: "60px" }}
                                        />
                                        <div className="d-block">
                                          <div className="title-class mb-2">
                                            <h1 style={{ color: "#C6CF9B" }}>
                                              {data.value}
                                            </h1>
                                            <p style={{ fontSize: "24px" }}>
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
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Coin;
