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
import { useMember } from "../useMember";
import InviteUserModal from "../../../components/ui/modals/InviteUserModal";
import { useEffect, useState } from "react";
import { User } from "lucide-react";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
{
    field: "profileUrl",
    headerName: "Profile",
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
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
            )}
        </div>
      </div>
    ),
  },
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "phoneNumber", headerName: "Phone", width: 150 },
  
];

export const MembersPage = () => {
  const {
    members,
    loading: isLoading,
    error: isError,
    getAllMembers,
  } = useMember();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
 useEffect(() => {
    getAllMembers({ page: 1, limit: 10 });
 }, []);
  
  if (isLoading) return <div>Loading...</div>;
  if (isError || !members) return <div className="text-white">Error fetching members</div>;
  return (
    <>
      <InviteUserModal
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
       <div className="pb-6 pt-6 lg:pb-4 lg:pt-8 px-4 xl:px-6">
      <Header
        name="Users"
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Invite Member
          </button>
        }
        />
        </div>
      <div style={{  width: "100%" }} className="flex flex-1">
        <DataGrid
          rows={members || []}
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
    </>
  );
};
