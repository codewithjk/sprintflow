import { CreateMeetingDTO, MeetingDTO, UpdateMeetingDTO } from "../../../../../../libs/shared/types/src";
import axios from "../../../utils/axiosInstance";



export const meetingAPI = {
  create: (data:Partial<CreateMeetingDTO>) => {
    return axios.post('/meeting', data);
   },
  getMeetings: (filters: Partial<MeetingDTO> & {page:number,limit:number} ) => {
  return axios.get('/meeting', { params: filters });
  },
  update: (meetingId:string,data:Partial<UpdateMeetingDTO>) => {
    return axios.put(`/meeting/${meetingId}`, data);
  },
  delete: (meetingId: string)=>{
    return axios.delete(`/meeting/${meetingId}`)
  }
    
}



