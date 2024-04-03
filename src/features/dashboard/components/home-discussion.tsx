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

function HomeDiscussion(props: any) {
  console.log(props, "discussion home");

  const [classList, setClassList] = useState<DiscussionListOutput>({
    classList: [],
  });

  const [tempClassList, setTempClassList] = useState<DiscussionListOutput>({
    classList: [],
  });

  const [classData, setClassData] = useState<ClassList>({
    id: 0,
    title: "",
    category: "",
    level: "",
    date: "",
    description: "",
    endtime: new Date(),
    image: "",
    maxPeople: "",
    price: "",
    starttime: new Date(),
    teacher: undefined,
    url: "",
  });

  const [searchText, setSearchText] = useState("");
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
      setTempClassList(
        transfromToDiscussionListOutput(response.data.outputSchema)
      );
      handleSearch();
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

  const limitTitle = (input: string): string => {
    const title = input;
    if (title.length >= 30) {
      return title.slice(0, 30) + "...";
    }

    return title;
  };

  function handleSearch() {
    if (props.searchData) {
      const findClass = tempClassList.classList.filter((u) =>
        u.title.toLowerCase().includes(props.searchText.toLowerCase())
      );
      setClassList({ classList: findClass });
    }
  }

  useEffect(() => {
    fetchDataDiscussion();
  }, []);
  console.log(classList, "discussiion");

  return (
    <>
      <div className="disc-container">
        <div className="w-100 m-1 d-flex row">
          <div className="filter">
            <div className="filter-btn">Subject</div>
            <div className="filter-btn">Education Level</div>
          </div>
          {currentClass.map((data, index) => (
            <div
              className="itemss col-md-3 align-items-center mb-1 p-1"
              key={index}
              onClick={() => handleShowModal(data)}
            >
              <div className="container-disc-header">
                <img
                  className="disc-image"
                  src={data.url || `assets/${data.image}`}
                  alt=""
                />

                <div className="bottom-left">{data.date}</div>
                <div className="top-left">
                  <img
                    className="img-fluid"
                    src={`assets/coin.png`}
                    alt=""
                    style={{ height: "14px" }}
                  />
                  <span style={{ marginLeft: "5px" }}>{data.price}</span>
                </div>
                <div className="top-right">Top Right</div>
                <div className="bottom-right">
                  {data.starttime.toString().slice(0, 5)} -{" "}
                  {data.endtime.toString().slice(0, 5)}
                </div>
              </div>

              <div className="disc-content">
                <div className="class">
                  <div className="d-flex">
                    <div className="me-2">
                      <img
                        src={"/assets/" + data.teacher?.account.urlImage}
                        width={"50px"}
                      />
                    </div>

                    <div className="disc-detail">
                      <div className="title-class">
                        <h3>{limitTitle(data.title)}</h3>
                        <span className="tooltip-title">{data.title}</span>
                      </div>
                      <h4 className="lecturer-discussion">
                        {data.teacher?.account.fullName}
                      </h4>

                      <div className="grouping">
                        <div className="chip">{data.category}</div>
                        <div className="chip">{data.level}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          totalClass={classList.classList.length}
          classPerPage={classPerPage}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
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
