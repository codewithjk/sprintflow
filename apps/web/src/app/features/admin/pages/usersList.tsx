import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

import Header from "../../../components/ui/header";
import { useAppSelector } from "../../../store/hooks";
import Image from "../../../components/ui/images";
import {
  dataGridClassNames,
  dataGridSxStyles,
} from "../../../../utils/dataGridStyles";

import InviteUserModal from "../../../components/ui/modals/InviteUserModal";
import { useEffect, useState } from "react";
import {  Ban, DoorClosed, DoorOpen, User } from "lucide-react";
import { useAdmin } from "../useAdmin";
import { UserStatus } from "../../../../../../../libs/domain/enums/user.enums";
import { toast } from "react-toastify";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);



export const UsersListPage = () => {
  const {
    users,
    fetchUsersLoading: isLoading,
    fetchUsersError: isError,
    fetchUsers,

     updateUserStatus,
        updateUsersError,
        updateUsersLoading,
    
  } = useAdmin();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  useEffect(() => {
    fetchUsers({ role: "user", page: 1, limit: 10 });
  }, []);
  useEffect(() => {
    if (updateUsersError) {
      toast.error(updateUsersError || "failed to change status")
    }
  },[updateUsersError])

  const handleBlock = (id:string) => {
    updateUserStatus(id, UserStatus.BLOCKED);
  };
  const handleActive = (id:string) => {
    updateUserStatus(id, UserStatus.ACTIVE);
  }

const columns: GridColDef[] = [
  {
    field: "profileUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
          {params.row.profileUrl ? (
            <Image
              src={params.row?.profileUrl}
              alt={params.row.name || "User Profile Picture"}
              width={35}
              height={35}
              className="h-full rounded-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
          )}
        </div>
      </div>
    ),
  },
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 150 ,flex:1},
  {
        field: "actions",
    headerName: "Actions",
    align: "center",
    headerAlign:"center",
        width: 150,
        sortable: false,
    renderCell: (params) => {
      const status = params.row.status;
      const id = params.row.id;
      return status == "active"?(
        <button
              disabled={updateUsersLoading}
              onClick={()=>handleBlock(id)}
              className="  rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600 mx-2"
            >
             <span className="flex gap-2 items-center"> <DoorClosed size={14} /> <p> Block</p></span>
          </button>
          ):(
          <button
              disabled={updateUsersLoading}
              onClick={()=>handleActive(id)}
              className="rounded bg-green-500 px-2 py-1 text-sm text-white hover:bg-green-600"
            >
             <span className="flex items-center gap-2"> <DoorOpen size={14} /> <p> Unblock</p></span>
            </button>

        )},
      },
];
  if (isLoading) return <div>Loading...</div>;
  if (isError || !users)
    return <div className="text-white">Error fetching users</div>;
  return (
    <div className="flex w-full flex-col p-8">
      <InviteUserModal
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header name="Users" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          getRowId={(row) => row.id}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};
