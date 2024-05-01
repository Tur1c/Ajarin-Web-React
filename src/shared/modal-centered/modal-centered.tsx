import { AxiosError } from "axios";
import Modal from "react-bootstrap/Modal";
import { FaUser } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "../../api/axios";
import { ClassList, JoinDiscussionSchema } from "../../model/course/course-list";
import "./modal-centered.css";

interface Props{
  show: boolean | undefined;
  onHide: () => void;
  data: ClassList;
  joined: boolean;
}

function ModalCentered({show,onHide,data,joined}:Props) {
  const isLogged = sessionStorage.getItem("jwt");
  const user = sessionStorage.getItem("user");
  const navigate = useNavigate();
  // console.log("modalehehe", props);

  const JOIN_URL = "/api/account/join";

  const JoinDiscussion = async (
    discId: number,
    maxParticipant: number,
    participant: number
  ) => {
    if (participant === maxParticipant) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Full Participant",
        background: "#11235a",
        color: "#fff",
        confirmButtonColor: "#f6e976",
        confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
      });
      return;
    }

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
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Success Join Discussion",
        background: "#11235a",
        color: "#fff",
        confirmButtonColor: "#f6e976",
        confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
      });
      window.location.reload();
      // const output = transfromToServiceLoginAccountOutput(response.data);
      // const token = output.token;
    } catch (error: any) {
      if (error instanceof AxiosError) {
        console.log(error?.response?.data.errorSchema);
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.errorSchema.message,
        background: "#11235a",
        color: "#fff",
        confirmButtonColor: "#f6e976",
        confirmButtonText: "<span style='color:#000'> <b>OK</b> </span>",
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      {...data}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="disc-modal-header ">
        <div className="modal-header-top">
          <div className="modal-close">
            <IoIosCloseCircleOutline
              onClick={onHide}
              style={{ color: "#fff", fontSize: "36px" }}
            />
          </div>
          <div
            className="centered fw-bold"
            style={{ width: "auto", gap: "1rem", fontSize: "18px" }}
          >
            <span>{data.date}</span>
            <span>|</span>
            <span>
              {data.starttime.toString().slice(0, 5)} -{" "}
              {data.endtime.toString().slice(0, 5)}
            </span>
          </div>
          <div className="lecturer-redirect">
            <img
              className="img-fluid"
              style={{ height: "2vw", width: "2vw", borderRadius: "0.25rem" }}
              src={"/assets/" + data.image}
              alt=""
            />
          </div>
        </div>
        <div className="modal-header-image">
          <img
            className="w-100"
            style={{
              // width: "max-content",
              height: "40vh",
              objectFit: "cover",
              borderRadius: "0.25rem",
            }}
            src={`assets/${data.image}`}
            alt=""
          />
        </div>
      </Modal.Header>
      <Modal.Body className="text-light w-100">
        <div className="modal-body-container">
          <div className="d-flex justify-content-between">
            <div>
              <h2>
                <b>{data.title}</b>
              </h2>
              <p className="disc-categories" style={{ opacity: "0.6" }}>
                {data.category} {"- "} {data.level}
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
                  <FaUser /> {data.participant} / {data.maxPeople}
                </div>
              </div>
            </div>
          </div>
          <div className="disc-description" style={{ height: "12vh" }}>
            <p>{data.description}</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className={(joined? "modal-footer-container-disabled" : "modal-footer-container") + " w-100 p-0"}>
        <div
          className=""
          style={{
            fontSize: "24px",
            width: "100%",
            height: "8vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p onClick={onHide} className="text-white pt-2">
            {isLogged ? (
              <button
                style={{
                  background: "none",
                  color: "white",
                  border: "none",
                  fontSize: "30px",
                  
                }}
                type="button"
                disabled={joined}
                onClick={() => JoinDiscussion(data.id, parseInt(data.maxPeople), data.participant)}
              >
                {
                  joined?
                  <span>Joined</span>
                  :
                  (
                    <>
                    Join{' '}
                    <img
                      className="img-fluid"
                      style={{
                        width: "36px",
                        height: "36px",
                      }}
                      src={`assets/coin.png`}
                      alt=""
                    />
                    <b style={{ color: "var(--yelo)" }}> {data.price}</b>
                    </>
                  )

                }
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
