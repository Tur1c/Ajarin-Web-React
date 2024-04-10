import React, { ReactNode, useState } from 'react'
import "./reqPrivate.css";
import "react-datepicker/dist/react-datepicker.css";
import { PrivateDiscInput, PrivateDiscOut } from '../../model/Account';
import axios from '../../api/axios';
import { ApiResponse } from '../../model/schema/base_schema';

interface ModalType{
    children?: ReactNode;
    isOpen: boolean;
    toggle: () => void;
    account:string|undefined;
    teacher:number;
    currPrivate: PrivateDiscOut;
    role:string;
}


const ReqPrivate = (props:ModalType) => {
    const [privateDisc,setPrivateDisc] = useState<PrivateDiscInput>({
        title:"",
        subject:"",
        education:"",
        difficulty:"",
        date:"",
        start_time:"",
        end_time:"",
        coin:0,
        user:undefined,
        teacher:undefined
    });

    const PRIVATE_URL = 'api/account/private?account=' + props.account + "&teacher=" + props.teacher;

const SubmitPrivate = async (e:any) => {
    e.preventDefault();
    console.log(privateDisc);

    try {
        const response = await axios.post<ApiResponse<PrivateDiscInput>>(
          PRIVATE_URL,
          JSON.stringify(privateDisc),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
            withCredentials: true,
          }
        );
          console.log(response);
      } catch (err) {
        console.log(err);
      }

}

const handlePrivateReq = async (status:string, e:any) => {
    e.preventDefault();
    console.log(status);
    let UPDATE_PRIVATE_URL = 'api/account/private/request?status=' + status + "&id=" + props.currPrivate.id;
    console.log(UPDATE_PRIVATE_URL);

    try {
        const response = await axios.post<ApiResponse<PrivateDiscInput>>(
          UPDATE_PRIVATE_URL,
          props.currPrivate.title,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
            withCredentials: true,
          }
        );
          console.log(response);
          window.location.reload();
      } catch (err) {
        console.log(err);
      }

}

  return (
    <>
        {props.role === "Student"? props.isOpen && (
            <div className="private-modal-overlay" onClick={props.toggle}>
                <div onClick={(e) => e.stopPropagation()} className="private-modal-box text-dark">
                    <p>Request Private</p>
                    <p>Fill the Form First</p>
                    <form onSubmit={(e) => {SubmitPrivate(e); props.toggle()}}> 
                        <div className="form-floating mb-3">
                            <input type="text" className='form-control' id='floatingTitle' placeholder="" required
                            onChange={(e) => setPrivateDisc({...privateDisc,title:e.target.value})}/>
                            <label htmlFor="floatingTitle">What Subject do you want to Request?</label>
                        </div>
                        <div className="second-row d-flex">
                            <div className="form-floating">
                                <input type="text"  className='form-control' id='floatingSubject' placeholder="" required 
                                onChange={(e) => setPrivateDisc({...privateDisc,subject:e.target.value})}/>
                                <label htmlFor="floatingSubject">Subject</label>
                            </div>
                            <div className="form-floating">
                                <input type="text"  className='form-control' id='floatingEducation' placeholder="" required
                                 onChange={(e) => setPrivateDisc({...privateDisc,education:e.target.value})}/>
                                <label htmlFor="floatingEducation">Education Level</label>
                            </div>
                        </div>
                        <div className="form-floating">
                            <textarea required className='form-control' id="floatingDifficulty" placeholder="" style={{ height:"12rem" }} 
                            onChange={(e) => setPrivateDisc({...privateDisc,difficulty:e.target.value})}></textarea>
                            <label htmlFor="floatingDifficulty">Can you explain your difficulty in understanding the Subject?</label>
                        </div>
                        <div className="fourth-row d-flex">
                            <div className="form-floating">
                                <input type="date"  className='form-control' id='floatingDate' placeholder="YYYY-MM-DD" required
                                onChange={(e) => setPrivateDisc({...privateDisc,date:e.target.value})}/>
                                <label htmlFor="floatingDate">Date</label>
                            </div>
                            <div className="form-floating">
                                <input type="time"  className='form-control' id='floatingStartTime' placeholder="" required
                                onChange={(e) => setPrivateDisc({...privateDisc,start_time:e.target.value})}/>
                                <label htmlFor="floatingStartTime">StartTime</label>
                            </div>
                            <div className="form-floating">
                                <input type="time"  className='form-control' id='floatingEndTime' placeholder="" required
                                onChange={(e) => setPrivateDisc({...privateDisc,end_time:e.target.value})}/>
                                <label htmlFor="floatingEndTime">EndTime</label>
                            </div>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="number" className='form-control' id='floatingCoin' placeholder="" required
                            onChange={(e) => setPrivateDisc({...privateDisc,coin:parseInt(e.target.value)})}/>
                            <label htmlFor="floatingCoin">Coin that you offer</label>
                        </div>
                            <button type='submit'>Submit</button>
                    </form>
                </div>
            </div>
        )
            :
            ( props.isOpen &&
                <div className="private-modal-overlay" onClick={props.toggle}>
                <div onClick={(e) => e.stopPropagation()} className="private-modal-box text-dark">
                    <form> 
                        <div className="form-floating mb-3">
                            <input disabled type="text" className='form-control' id='floatingTitle' placeholder="" value={props.currPrivate.title}/>
                            <label htmlFor="floatingTitle">What Subject do you want to Request?</label>
                        </div>
                        <div className="second-row d-flex">
                            <div className="form-floating">
                                <input disabled type="text"  className='form-control' id='floatingSubject' placeholder="" value={props.currPrivate.subject}
                                />
                                <label htmlFor="floatingSubject">Subject</label>
                            </div>
                            <div className="form-floating">
                                <input disabled type="text"  className='form-control' id='floatingEducation' placeholder=""
                                 value={props.currPrivate.education}/>
                                <label htmlFor="floatingEducation">Education Level</label>
                            </div>
                        </div>
                        <div className="form-floating">
                            <textarea disabled className='form-control' id="floatingDifficulty" placeholder="" style={{ height:"12rem" }} 
                            value={props.currPrivate.difficulty}></textarea>
                            <label htmlFor="floatingDifficulty">Can you explain your difficulty in understanding the Subject?</label>
                        </div>
                        <div className="fourth-row d-flex">
                            <div className="form-floating">
                                <input type="text" disabled className='form-control' id='floatingDate' placeholder="YYYY-MM-DD" value={props.currPrivate.date}/>
                                <label htmlFor="floatingDate">Date</label>
                            </div>
                            <div className="form-floating">
                                <input type="text"  disabled className='form-control' id='floatingStartTime' placeholder="" value={props.currPrivate.start_time + " - " + props.currPrivate.end_time}/>
                                <label htmlFor="floatingStartTime">Time</label>
                            </div>
                        </div>
                        <div className="form-floating mb-3">
                            <input type="number" disabled className='form-control' id='floatingCoin' placeholder="" value={props.currPrivate.coin}/>
                            <label htmlFor="floatingCoin">Coin that you offer</label>
                        </div>
                            <button onClick={(e) => {handlePrivateReq("Accepted",e);props.toggle()}}>Accept</button>
                            <button onClick={(e) => {handlePrivateReq("Rejected",e);props.toggle()}}>Decline</button>
                    </form>
                </div>
            </div>
            )
        }
    </>
  )
}

export default ReqPrivate