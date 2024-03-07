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
  console.log(props, "modalehehe");

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
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="p-0 d-block">
        <div className="container-class-header d-flex justify-content-around" style={{height: "2rem"}}>
          <div className="p-1" style={{ backgroundColor: "#000" }}>
            <IoIosCloseCircleOutline
              onClick={props.onHide}
              style={{ color: "#fff" }}
            />
          </div>
          <div
            className=""
            style={{ backgroundColor: "#596FB7", width: "450px" }}
          >
            <span>
              {props.data.date} {props.data.starttime.toString()} -{" "}
              {props.data.endtime.toString()}
            </span>
          </div>
          <div className="p-1" style={{ backgroundColor: "#000" }}>
            <IoIosCloseCircleOutline
              onClick={props.onHide}
              style={{ color: "#fff" }}
            />
          </div>
        </div>
          <div className="container-class-header pt-3">
            <img
              className=""
              style={{width: "80%"}}
              src={`assets/${props.data.image}`}
              alt=""
            />
          </div>
      </Modal.Header>
      <Modal.Body className="p-5">
        <div className="modal-body-container">
          <div className="header d-flex justify-content-between">
            <div className="header-title text-dark">
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
          <p className="text-dark">{props.data.description}</p>
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
