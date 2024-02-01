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

const CLASS_URL = "/api/discussion";

function Home() {
  const [classList, setClassList] = useState<DiscussionListOutput>({
    classList: [],
  });

  const [currentPage, setCurrentPage] = useState(2);
  const [classPerPage, setClassPerPage] = useState(8);

  const lastClassIndex = currentPage * classPerPage;
  const firstClassIndex = lastClassIndex - classPerPage;
  const currentClass = classList.classList.slice(firstClassIndex, lastClassIndex)

  const fetchData = async () => {
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

              <div className="class-wrapper">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      {currentClass.map((data, index) => (
                        <div className="col-md-3">
                          <p key={index}>{data.date}</p>
                        </div>
                      ))}
                      <Pagination totalClass={classList.classList.length} classPerPage={classPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
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
