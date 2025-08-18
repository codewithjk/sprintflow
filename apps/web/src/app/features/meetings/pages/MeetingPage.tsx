import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { PlusSquare, Trash2 } from "lucide-react";
import Header from "../../../components/ui/header";
import { useAppSelector } from "../../../store/hooks";
import React, { Suspense, useEffect, useState } from "react";
import { useMeeting } from "../useMeeting";
import NewMeetingModal from "../../../components/ui/modals/NewMeetingModal";
import {
  dataGridClassNames,
  dataGridSxStyles,
} from "../../../../utils/dataGridStyles";
import { format } from "date-fns";
import { useAuth } from "../../auth/useAuth";
import moment from "moment/moment";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../../components/ui/popup/ConformationDialog";
import { CreateMeetingDTO } from "../../../../../../../libs/shared/types/src";

const MeetingScreen = React.lazy(() => import("./MeetingScreen"));



export const MeetingPage = () => {
  const {
    total,
    meetings,
    fetchError,
    fetchLoading,
    createMeeting,
    fetchMeetings,
    deleteMeeting,
  } = useMeeting();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewMeetingOpen, setIsModalNewMeetingOpen] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);

  const [roomId, setRoomId] = useState(null);
  const { user } = useAuth();

  const [paginationModel, setPaginationModel] = useState({
  page: 0, 
  pageSize: 10,
});

useEffect(() => {
  if (!user) return;

  const orgId = user?.role === "user" ? user?.orgId : user?.id;

  fetchMeetings({
    orgId,
    page: paginationModel.page + 1, // API is 1-based
    limit: paginationModel.pageSize,
  });
}, [paginationModel, user]);

  if (fetchLoading) return <div>Loading...</div>;
  if (fetchError)
    return <div className="text-white">Error fetching meetings</div>;

  const handleNewMeetingCreation = async (data: Partial<CreateMeetingDTO>) => {
    await createMeeting(data);
  };

  const handleCloseMeeting = () => {
    setRoomId(null);
  };

  const handleDelete = (meetingId: string) => {
    setMeetingToDelete(meetingId);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!meetingToDelete) return;

    try {
      const res = await deleteMeeting(meetingToDelete);
      if (res.success) {
        toast.success("Meeting deleted successfully!");
      } else {
        toast.error(res.message || "Failed to delete meeting");
      }
    } catch (error) {
      toast.error("Unable to delete! Try again.");
    } finally {
      setDialogOpen(false);
      setMeetingToDelete(null);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Meeting Name", flex: 1 },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 150,
      valueFormatter: (params) => format(new Date(params), "dd MMM yyyy"),
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 150,
      valueFormatter: (params) => format(new Date(params), "dd MMM yyyy"),
    },
    {
      field: "joins",
      headerName: "Join",
      width: 300,
      sortable: false,
      renderCell: (params) => {
        const startTime = new Date(params.row.startTime);
        const endTime = new Date(params.row.endTime);
        const current = new Date();

        const beforeMeetingStart = startTime > current;
        const afterMeetingEnd = endTime < current;
        const canJoinMeeting = endTime > current && current > startTime;

        return (
          <div>
            {canJoinMeeting && (
              <button
                onClick={() => setRoomId(params.row.roomId)}
                className="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
              >
                Join now
              </button>
            )}

            {afterMeetingEnd && (
              <span className="text-red-500 text-xs">
                Meeting ended {moment(params.row.endTime).fromNow()}
              </span>
            )}

            {beforeMeetingStart && (
              <span className="text-gray-500 text-xs">
                Starts {moment(params.row.startTime).fromNow()}
              </span>
            )}
          </div>
        );
      },
    },
    ...(user?.role === "organization"
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: 150,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
              <div>
                <button
                  onClick={() => handleDelete(params.row.id)}
                  className="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {/* header */}
      <div className="px-4 xl:px-6">
        <NewMeetingModal
          onSubmit={handleNewMeetingCreation}
          isOpen={isModalNewMeetingOpen}
          onClose={() => setIsModalNewMeetingOpen(false)}
        />

        <ConfirmationDialog
          isOpen={isDialogOpen}
          title="Delete this meeting?"
          description="Are you sure you want to permanently delete this meeting? This action cannot be undone."
          onCancel={() => {
            setDialogOpen(false);
            setMeetingToDelete(null);
          }}
          onConfirm={confirmDelete}
        />

        <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
          <Header
            name="Meetings"
            buttonComponent={
              user && user.role === "organization" ? (
                <button
                  className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                  onClick={() => setIsModalNewMeetingOpen(true)}
                >
                  <PlusSquare className="mr-2 h-5 w-5" /> New Meeting
                </button>
              ) : null
            }
          />
        </div>
      </div>

      <div style={{  width: "100%" }} className="flex flex-1">
        <DataGrid
          rows={meetings || []}
          columns={columns}
          getRowId={(row) => row.id}
          pagination
          paginationMode="server"
          rowCount={total}
          pageSizeOptions={[5, 10, 25, 50]}
  paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  loading={fetchLoading}
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
      {roomId && (
  <Suspense fallback={<div className="text-white">Loading Meeting Screen...</div>}>
    <MeetingScreen roomId={roomId} onClose={handleCloseMeeting} />
  </Suspense>
)}

    </>
  );
};

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);
