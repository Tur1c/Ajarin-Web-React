import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import axios from "../../api/axios";
import { AccountOutput } from "../../model/Account";
import { ApiResponse } from "../../model/schema/base_schema";
import {
  InquiryTeacherSchema,
  TeacherListOutput,
  transfromToTeacherListOutput,
} from "../../model/teacher/teacher-model";
import { Sidebar } from "../../shared";
import "./lecturer.css";

const INQUIRY_TEACHER = "/api/account/inquiry/teacher";

const Lecturer = () => {
  const { state } = useLocation();

  const [teachers, setTeacher] = useState<TeacherListOutput>({
    teachers: [],
  });

  const account: AccountOutput = !state?.firstName ? undefined : state;

  const fetchTeacherData = async () => {
    try {
      const response = await axios.get<ApiResponse<InquiryTeacherSchema>>(
        INQUIRY_TEACHER,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setTeacher(transfromToTeacherListOutput(response.data.outputSchema));
    } catch (error) {}
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  return (
    <div className="all-page">
      <div className="sidebar-content">
        <Sidebar account={account}></Sidebar>
      </div>
      <div className="lecturer-content">
        <div className="greetings">
          <h3>Lecturer Leaderboard</h3>
          <h4>
            <span>
              There are{" "}
              <span style={{ color: "#F6ECA9", fontWeight: "bold" }}>
                10 Best Lecturer
              </span>{" "}
              of this Month! Congratulations!
            </span>
          </h4>
        </div>
        <div className="table-container p-4">
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="text-white">#</TableCell>
                  <TableCell className="text-white">Name</TableCell>
                  <TableCell className="text-white">Course Sold</TableCell>
                  <TableCell className="text-white">Discussion Participant</TableCell>
                  <TableCell className="text-white">Forum Points</TableCell>
                  <TableCell className="text-white">Rating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.teachers.map((data, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" className="text-white">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-white">
                      <img
                        className="img-fluid"
                        src={data.account.urlImage}
                        alt=""
                        style={{ height: "10%", width: "10%" }}
                      />
                      {data.account.fullName}
                    </TableCell>
                    <TableCell className="text-white">100 solds</TableCell>
                    <TableCell className="text-white">200 Participants</TableCell>
                    <TableCell className="text-white">96 Points</TableCell>
                    <TableCell className="text-white">
                      <FaStar style={{color: "green", fontSize: "25px", marginRight: "5px"}}/> {data.rating}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Lecturer;
