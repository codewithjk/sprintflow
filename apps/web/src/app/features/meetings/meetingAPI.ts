
import { MeetingProps } from "../../../../../../libs/domain/entities/meeting.entity";
import axios from "../../../utils/axiosInstance";



export const meetingAPI = {
  create: (data:Partial<MeetingProps>) => {
    return axios.post('/meeting', data);
   },
  getMeetings: (filters: Partial<MeetingProps> & {page:number,limit:number} ) => {
  return axios.get('/meeting', { params: filters });
  },
  update: (meetingId:string,data:Partial<MeetingProps>) => {
    return axios.put(`/meeting/${meetingId}`, data);
  },
  delete: (meetingId: string)=>{
    return axios.delete(`/meeting/${meetingId}`)
  }
    
}



