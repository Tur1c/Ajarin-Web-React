import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  ClassList,
  DiscussionListOutput,
  DiscussionListSchema,
  transfromToDiscussionListOutput,
} from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import { ModalCentered, Pagination } from "../../../shared";

const CLASS_URL = "/api/discussion";

function HomeDiscussion() {
  const [classList, setClassList] = useState<DiscussionListOutput>({
    classList: [],
  });

  const [classData, setClassData] = useState<ClassList>({
    id: 0,
    title: "",
    category: [],
    date: new Date(),
    description: "",
    endtime: new Date(),
    image: "",
    maxPeople: "",
    price: "",
    starttime: new Date(),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [classPerPage, setClassPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false);

  const lastClassIndex = currentPage * classPerPage;
  const firstClassIndex = lastClassIndex - classPerPage;
  const currentClass = classList.classList.slice(
    firstClassIndex,
    lastClassIndex
  );

  function handlePageChange(value: any) {
    if (value === "&laquo;" || value === "... ") {
      setCurrentPage(1);
    } else if (value === "&lsaquo;") {
      if (currentPage !== 1) {
        setCurrentPage(currentPage - 1);
      }
    } else if (value === "&rsaquo;") {
      if (
        currentPage !== Math.ceil(classList.classList.length / classPerPage)
      ) {
        setCurrentPage(currentPage + 1);
      }
    } else if (value === "&raquo;" || value === " ...") {
      setCurrentPage(Math.ceil(classList.classList.length / classPerPage));
    } else {
      setCurrentPage(value);
    }
  }

  const fetchDataDiscussion = async () => {
    try {
      const response = await axios.get<ApiResponse<DiscussionListSchema>>(
        CLASS_URL,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setClassList(transfromToDiscussionListOutput(response.data.outputSchema));
    } catch (error) {}
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (data: ClassList) => {
    setClassData({
      ...classData,
      id: data.id,
      category: data.category,
      date: data.date,
      description: data.description,
      endtime: data.endtime,
      image: data.image,
      maxPeople: data.maxPeople,
      price: data.price,
      starttime: data.starttime,
      title: data.title,
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchDataDiscussion();
  }, []);
  return (
    <>
      <div className="class-wrapper">
        <div
          className="card"
          style={{ backgroundColor: "#11235a", border: "none" }}
        >
          <div className="card-body">
            <div className="row">
              {currentClass.map((data, index) => (
                <div
                  className="col-md-3 d-flex align-items-stretch mb-3"
                  key={index}
                  onClick={() => handleShowModal(data)}
                >
                  <div
                    className="card"
                    style={{
                      background: "transparent",
                      border: "none",
                    }}
                  >
                    <div className="container-class-header">
                      <img
                        className="disc-image img-fluid"
                        src={`assets/${data.image}`}
                        alt=""
                        style={{ height: "10rem" }}
                      />
                      <div className="bottom-left">{data.date.toString()}</div>
                      <div className="top-left p-1">
                        <img
                          className="img-fluid"
                          src={`assets/coin.png`}
                          alt=""
                          style={{ height: "24px" }}
                        />
                        <span style={{ marginLeft: "5px" }}>{data.price}</span>
                      </div>
                      <div className="top-right">Top Right</div>
                      <div className="bottom-right">
                        {data.starttime.toString()} - {data.endtime.toString()}
                      </div>
                    </div>
                    <div className="card-body p-2">
                      <div className="card-text">
                        <div className="class-content">
                          <div className="class">
                            <div className="d-flex">
                              <div className="me-2">
                                <img src={`assets/coin.png`} alt="abc" />
                              </div>
                              <div className="d-block">
                                <div className="title-class mb-2">
                                  <h3>{data.title}</h3>
                                  <span>Pengajar</span>
                                </div>
                                {data.category.map((category, index) => (
                                  <span
                                    className="badge badge-outlined text-white me-2"
                                    key={index}
                                  >
                                    {category}
                                  </span>
                                ))}
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
          <Pagination
            totalClass={classList.classList.length}
            classPerPage={classPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>

      <ModalCentered
        show={showModal}
        onHide={handleCloseModal}
        data={classData}
      />
    </>
  );
}

export default HomeDiscussion;
