
import { useState } from "react";


import { Meeting, MeetingProps } from "../../../../../../libs/domain/entities/meeting.entity";
import { meetingAPI } from "./meetingAPI";


export function useMeeting() {

    const [createLoading, setCreateLoading] = useState<boolean>(false)
    const [fetchLoading, setFetchLoading] = useState<boolean>(false)
    const [createError, setCreateError] = useState<boolean>(false)
    const [fetchError, setFetchError] = useState<boolean>(false)
    const [meetings, setMeetings] = useState<Meeting[]>([]);

     const [total, setTotal] = useState(0);
     const [page, setPage] = useState(1); 
     const [pageSize, setPageSize] = useState(10); 


    const createMeeting = async (data: Partial<MeetingProps>) => {
        setCreateLoading(true);
        try {
            const res = await meetingAPI.create(data);
            setMeetings((pre) => [...pre, res.data.meeting])
        } catch (error: any) {
            setCreateError(error.response.data.message)
        } finally {
            setCreateLoading(false)
        }
    }
    const fetchMeetings = async (filter: Partial<Meeting> & { limit: number, page: number }) => {
        setFetchLoading(true);
        try {
            const res = await meetingAPI.getMeetings(filter);
            setMeetings(res.data.meetings);
            setTotal(res.data.total);
      setPage(res.data.page);
      setPageSize(res.data.pageSize);
        } catch (error: any) {
            setFetchError(error.response.data.message)
        } finally {
            setFetchLoading(false)
        }

    }
    const deleteMeeting = async (meetingId: string) => {
        try {
            await meetingAPI.delete(meetingId);
            setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || "Failed to delete meeting" };
        }
    };

    return {   total,page,pageSize, meetings, createLoading, fetchLoading, createError, fetchError, fetchMeetings, createMeeting, deleteMeeting }
}

