import { AxiosError } from "axios";
import Modal from "react-bootstrap/Modal";
import { FaUser } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { JoinDiscussionSchema } from "../../model/course/course-list";
import "./modal-centered.css";

function ModalCentered(props: any) {
  const isLogged = sessionStorage.getItem("jwt");
  const user = sessionStorage.getItem("user");
  const navigate = useNavigate();
  console.log("modalehehe", props);

  const JOIN_URL = "/api/account/join";

  const JoinDiscussion = async (discId: number) => {
    try {
      let schema: JoinDiscussionSchema = {
        email: user,
        id: discId,
      };
      console.log(schema.email, schema.id);
      const response = await axios.post(JOIN_URL, JSON.stringify(schema), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        },
        withCredentials: true,
      });

      console.log(response, "asd");
      window.location.reload();
      // const output = transfromToServiceLoginAccountOutput(response.data);
      // const token = output.token;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.data.errorSchema);
      }
    }
  };

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="disc-modal-header">
        <div className="modal-header-top">
          <div className="modal-close">
            <IoIosCloseCircleOutline
              onClick={props.onHide}
              style={{ color: "#fff", fontSize: "36px" }}
            />
          </div>
          <div className="centered" style={{ width: "450px", gap: "0.75rem" }}>
            <span>{props.data.date}</span>
            <span>|</span>
            <span>
              {props.data.starttime.toString()} -{" "}
              {props.data.endtime.toString()}
            </span>
          </div>
          <div className="lecturer-redirect">
            <img
              className="img-fluid rounded-circle"
              style={{ height: "36px", width: "36px" }}
              src={`assets/${props.data.image}`}
              alt=""
            />
          </div>
        </div>
        <div className="modal-header-image">
          <img
            className="px-2"
            style={{
              width: "60vw",
              height: "40vh",
              objectFit: "cover",
              marginTop: "1rem",
            }}
            src={`assets/${props.data.image}`}
            alt=""
          />
        </div>
      </Modal.Header>
      <Modal.Body className="text-light w-100 px-4">
        <div className="modal-body-container">
          <div className="d-flex justify-content-between">
            <div className="">
              <h2>
                <b>{props.data.title}</b>
              </h2>
              <p className="disc-categories" style={{ opacity: "0.6" }}>
                Math
              </p>
            </div>
            <div
              style={{
                textAlign: "center",
                display: "flex",
              }}
            >
              <div
                className="badge bagde-pill bg-danger text-white"
                style={{
                  height: "64px",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div className="text-center" style={{ fontSize: "24px" }}>
                  <FaUser /> 12 / {props.data.maxPeople}
                </div>
              </div>
            </div>
          </div>
          <div className="disc-description" style={{ height: "10vh" }}>
            <p>{props.data.description}</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer-container w-100 p-0">
        <div
          className=""
          style={{
            fontSize: "24px",
            width: "100%",
            height: "4rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p onClick={props.onHide} className="text-white pt-2">
            {isLogged ? (
              <button
                style={{
                  background: "none",
                  color: "white",
                  border: "none",
                  fontSize: "30px",
                }}
                type="button"
                onClick={() => JoinDiscussion(props.data.id)}
              >
                Join{" "}
                <img
                  className="img-fluid"
                  style={{
                    width: "36px",
                    height: "36px",
                  }}
                  src={`assets/coin.png`}
                  alt=""
                />
                <b style={{ color: "var(--yelo)" }}> {props.data.price}</b>
              </button>
            ) : (
              <b onClick={() => navigate("/login")}>Log In</b>
            )}
          </p>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCentered;
