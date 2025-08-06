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
import { User } from "lucide-react";
import { useAdmin } from "../useAdmin";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  {
    field: "profileUrl",
    headerName: "Logo",
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
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "plan", headerName: "Plan", width: 150 },
  
];

export const OrganizationsListPage = () => {
  const {
    organizations,
    fetchOrganizationsLoading: isLoading,
    fetchOrganizationsError: isError,
    fetchOrganizations,
  } = useAdmin();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  useEffect(() => {
    fetchOrganizations({ page: 1, limit: 10 });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !organizations)
    return <div className="text-white">Error fetching organizations</div>;
  return (
    <div className="flex w-full flex-col p-8">
      <InviteUserModal
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Organizations"
      />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={organizations || []}
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
