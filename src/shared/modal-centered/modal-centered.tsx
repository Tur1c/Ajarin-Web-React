import { AxiosError } from "axios";
import Modal from "react-bootstrap/Modal";
import { FaUser } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "../../api/axios";
import "./modal-centered.css";

function ModalCentered(props: any) {
  const isLogged = sessionStorage.getItem("jwt");
  const user = sessionStorage.getItem("user");
  console.log(isLogged, user);
  const JOIN_URL = "/api/account/join?email=" + user + "&id=1";

  const JoinDiscussion = async (discId: number) => {
    // alert("join" + discId);
    try {
      const response = await axios.post(
        JOIN_URL,
        // JSON.stringify(accountLogin),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
          withCredentials: true,
        }
      );
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      // setAuth({ accountLogin, accessToken, roles });
      // const output = transfromToServiceLoginAccountOutput(response.data);
      // const token = output.token;
      // localStorage.setItem("jwt", token);
      // localStorage.setItem("user", accountLogin.email);
      // await login({ accountLogin, token });
      // navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        // console.log(error?.response?.data.errorSchema);
      }
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="p-0">
        <div className="container-class-header">
          <img
            className="disc-image img-fluid"
            src={`assets/${props.data.image}`}
            alt=""
          />
          <div className="top-left p-1" style={{ backgroundColor: "#000" }}>
            <IoIosCloseCircleOutline
              onClick={props.onHide}
              style={{ color: "#fff" }}
            />
          </div>
          <div
            className="centered"
            style={{ backgroundColor: "#596FB7", width: "450px" }}
          >
            <span>
              {props.data.date} {props.data.starttime.toString()} -{" "}
              {props.data.endtime.toString()}
            </span>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="p-5">
        <div className="modal-body-container">
          <div className="header d-flex justify-content-between">
            <div className="header-title">
              <h2>
                <b>{props.data.title}</b>
              </h2>
              <p>Math</p>
            </div>
            <div
              style={{
                textAlign: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className="badge bagde-pill bg-danger text-white"
                style={{
                  height: "50px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="text-center" style={{ fontSize: "20px" }}>
                  <FaUser /> 12 / {props.data.maxPeople}
                </div>
              </div>
            </div>
          </div>
          <p>{props.data.description}</p>
        </div>
      </Modal.Body>
      <Modal.Footer className="p-0">
        <div
          className="modal-footer-center"
          style={{
            backgroundColor: "#11235a",
            fontSize: "20px",
            width: "100%",
            height: "75px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p onClick={props.onHide} className="text-white">
            {isLogged ? (
              <button
                type="button"
                onClick={() => JoinDiscussion(props.data.id)}
              >
                Join
              </button>
            ) : (
              <b>Log In</b>
            )}
          </p>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCentered;
