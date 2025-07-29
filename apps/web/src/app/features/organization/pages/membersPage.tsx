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
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Username", width: 150 },
  {
    field: "profileUrl",
    headerName: "Profile Picture",
    width: 100,
    renderCell: (params) => (
    
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
           {params.row.profileUrl ? (
                        <Image
                src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${params.row?.profileUrl}`}
                alt={params.row.name || "User Profile Picture"}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
            )}
        </div>
      </div>
    ),
  },
];

export const MembersPage = () => {
  console.log("member")
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
  
  console.log(members)
  if (isLoading) return <div>Loading...</div>;
  if (isError || !members) return <div className="text-white">Error fetching members</div>;
  return (
    <div className="flex w-full flex-col p-8">
      <InviteUserModal
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
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
      <div style={{ height: 650, width: "100%" }}>
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
    </div>
  );
};
