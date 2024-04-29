import { useEffect, useState } from "react";
import axios from "../../../api/axios";
// import { CategoryListOutput } from "../../../model/category/category-model";
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
  console.log("discussion home", props);

  const [classList, setClassList] = useState<DiscussionListOutput>({
    classList: [],
  });

  const [tempClassList, setTempClassList] = useState<DiscussionListOutput>({
    classList: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const filteredList = classList.classList.filter((discussion) => {
    return discussion.id < 5;
  });
  const currentFiltered = filteredList.slice(0, 3);
  const [searchTextFromHome, setSearchTextFromHome] = useState("");

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
    participant: 0,
  });

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [classPerPage, setClassPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [statusSortSubject, setStatusSortSubject] = useState(false);
  const [statusSortEducation, setStatusSortEducation] = useState(false);

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
    setIsLoading(true);
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
    } catch (error) {}
    setIsLoading(false);
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
      participant: data.participant,
      level: data.level,
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
    setCurrentPage(1);
    if (props.searchData || searchTextFromHome) {
      if (props.searchData != "default") {
        setSearchTextFromHome(props.searchData);
      } else {
        setClassList(tempClassList);
        return;
      }
      const findClass = tempClassList.classList.filter((u) =>
        u.title.toLowerCase().includes(searchTextFromHome.toLowerCase()) ||
        u.teacher?.user.fullName.toLocaleLowerCase().includes(searchTextFromHome.toLowerCase())
      );
      setClassList({ classList: findClass });
    } else {
      setClassList(tempClassList);
    }
    console.log(currentClass, "curr class");
    
  }

  useEffect(() => {
    fetchDataDiscussion();
  }, []);
  console.log("discussion", classList);
  console.log("filtered discussion", currentFiltered);

  useEffect(() => {
    handleSearch();
  }, [props.searchData, searchTextFromHome]);

  const sortBySubject = async () => {
    setIsLoading(true);
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
      if (!statusSortSubject) {
        tempClassList.classList.sort((a, b) =>
          a.category < b.category ? -1 : 1
        );
        setClassList({ classList: tempClassList.classList });
        setStatusSortSubject(!statusSortSubject);
      } else {
        tempClassList.classList.sort((a, b) =>
          a.category > b.category ? -1 : 1
        );
        setClassList({ classList: tempClassList.classList });
        setStatusSortSubject(!statusSortSubject);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  const sortByEducation = async () => {
    setIsLoading(true);
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
      if (!statusSortEducation) {
        tempClassList.classList.sort((a, b) => (a.level < b.level ? -1 : 1));
        setClassList({ classList: tempClassList.classList });
        setStatusSortEducation(!statusSortEducation);
      } else {
        tempClassList.classList.sort((a, b) => (a.level > b.level ? -1 : 1));
        setClassList({ classList: tempClassList.classList });
        setStatusSortEducation(!statusSortEducation);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  return (
    <>
      {!isLoading ? (
        <div className="disc-container homes">
          <div className="m-1 d-flex row">
            <div className="filter">
              {/* <div className="filter-btn">Subject</div>
            <div className="filter-btn">Education Level</div> */}
              <div className="filter-btn" onClick={() => sortBySubject()}>
                Subject
              </div>
              <div className="filter-btn" onClick={() => sortByEducation()}>
                Education Level
                {/* </div> */}
              </div>
            </div>
            {currentClass.length > 0 ? (
              <>
                {currentClass.map((data, index) => (
                  <div
                    className="itemss col-md-3 align-items-center mb-1 p-1"
                    key={index}
                    onClick={() => handleShowModal(data)}
                  >
                    <div className="container-disc-header">
                      <img
                        className="disc-image"
                        src={`assets/${data.image}`}
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
                      <div className="top-right">
                        {data.participant}/{data.maxPeople}
                      </div>
                      <div className="bottom-right">
                        {data.starttime.toString().slice(0, 5)} -{" "}
                        {data.endtime.toString().slice(0, 5)}
                      </div>
                    </div>

                    <div className="disc-content">
                      <div className="class">
                        <div className="d-flex">
                          <div className="lecturer-profile me-2">
                            <img
                              src={"/assets/" + data.teacher?.user.urlImage}
                            />
                          </div>

                          <div className="disc-detail">
                            <div className="title-class">
                              <h3>{limitTitle(data.title)}</h3>
                              <span className="tooltip-title">
                                {data.title}
                              </span>
                            </div>
                            <h4 className="lecturer-discussion">
                              {data.teacher?.user.fullName}
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
              </>
            ) : (
              <div
                className="d-flex justify-content-center align-items-center text-white"
                style={{ height: "25rem" }}
              >
                No Discussion Found
              </div>
            )}
          </div>

          <Pagination
            totalClass={classList.classList.length}
            classPerPage={classPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "60vh" }}
        >
          <svg
            width="80"
            height="80"
            stroke="#fff"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <circle
                cx="12"
                cy="12"
                r="9.5"
                fill="none"
                stroke-width="3"
                stroke-linecap="round"
              >
                <animate
                  attributeName="stroke-dasharray"
                  dur="1.5s"
                  calcMode="spline"
                  values="0 150;42 150;42 150;42 150"
                  keyTimes="0;0.475;0.95;1"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dashoffset"
                  dur="1.5s"
                  calcMode="spline"
                  values="0;-16;-59;-59"
                  keyTimes="0;0.475;0.95;1"
                  keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                  repeatCount="indefinite"
                />
              </circle>
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="2s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </g>
          </svg>
        </div>
      )}

      <ModalCentered
        show={showModal}
        onHide={handleCloseModal}
        data={classData}
      />
    </>
  );
}

export default HomeDiscussion;
