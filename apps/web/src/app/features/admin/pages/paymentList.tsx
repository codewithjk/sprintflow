import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

import Header from "../../../components/ui/header";
import { useAppSelector } from "../../../store/hooks";
import {
  dataGridClassNames,
  dataGridSxStyles,
} from "../../../../utils/dataGridStyles";

import InviteUserModal from "../../../components/ui/modals/InviteUserModal";
import { useEffect, useState } from "react";

import { useAdmin } from "../useAdmin";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "amount", headerName: "Amount", width: 150, flex: 1 },
  {
    align: "center",
    headerAlign: "center",
    field: "receiptUrl",
    headerName: "Receipt",
      width: 150,
    renderCell: (params) => (
      <a
        href={params.row.receiptUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
      >
        Receipt
      </a>
    ),
  },
];

export const PaymentListPage = () => {
  const { charges, fetchCharges, fetchChargesError, fetchChargesLoading } =
    useAdmin();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  useEffect(() => {
    fetchCharges(10);
  }, []);


  if (fetchChargesLoading) return <div>Loading...</div>;
  if (fetchChargesError || !charges)
    return <div className="text-white">Error fetching charges</div>;
  return (
    <div className="flex w-full flex-col p-8">
      <InviteUserModal
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header name="Payment history" />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={charges || []}
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
