import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import axios from "../../../api/axios";
import {
  DiscussionListOutput,
  DiscussionListSchema,
  transfromToDiscussionListOutput,
} from "../../../model/course/course-list";
import { ApiResponse } from "../../../model/schema/base_schema";
import { Pagination, Sidebar } from "../../../shared";
import "./home.css";
import Tabs from "../tabs/Tabs";

const CLASS_URL = "/api/discussion";

function Home() {
  const [classList, setClassList] = useState<DiscussionListOutput>({
    classList: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [classPerPage, setClassPerPage] = useState(8);

  const [selected, setSelected] = useState();

  const lastClassIndex = currentPage * classPerPage;
  const firstClassIndex = lastClassIndex - classPerPage;
  const currentClass = classList.classList.slice(
    firstClassIndex,
    lastClassIndex
  );

  // let pageNo = 1;
  // if (currentPage <= Math.ceil(classList.classList.length / classPerPage)) {
  //   pageNo = currentPage;
  // } else {
  //   setCurrentPage(Math.ceil(classList.classList.length / classPerPage));
  //   pageNo = currentPage;
  // }

  function handleTabClick(selectedTab:any){
    setSelected(selectedTab);
  }

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

  const fetchData = async () => {
    try {
      const response = await axios.get<ApiResponse<DiscussionListSchema>>(
        CLASS_URL,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
      setClassList(transfromToDiscussionListOutput(response.data.outputSchema));
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div>
      <Sidebar>
        <div className="container">
          <div className="row">
            <div className="col-9">
              <div className="search-wrapper">
                <div className="search-container">
                  <IoSearch />
                  <input
                    type="search"
                    name=""
                    id="search-input"
                    placeholder="Search"
                  />
                  <button id="search">Search</button>
                </div>
              </div>

              <div className="home-wrapper">
                <div className="greetings">
                  <h1>Hello,</h1>
                  <h4>
                    <i>Ready to Learn Something New ?</i>
                  </h4>
                </div>
                <span style={{ alignItems: "flex-end" }}>12</span>
              </div>

            {/* <Tabs isSelected={selected === 'course'}
            onClick={() => handleTabClick('course')}>
              Course
            </Tabs> */}
            
              <div className="class-wrapper">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      {currentClass.map((data, index) => (
                        <div className="col-md-3" key={index}>
                          <img className="disc-image" src={`assets/${data.image}` } alt="" />
                          <p>{data.date.toString()}</p>
                        </div>
                      ))}
                      <Pagination
                        totalClass={classList.classList.length}
                        classPerPage={classPerPage}
                        onPageChange={handlePageChange}
                        currentPage={currentPage}
                      />
                      {/* <ClassList data={classList}/> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-3">aa</div>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default Home;
