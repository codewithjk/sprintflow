


import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  dataGridClassNames,
  dataGridSxStyles,
} from "../../../../utils/dataGridStyles";


import {  useState } from "react";

import { useProject } from "../useProject";
import NewProjectModal from "../../../components/ui/modals/NewProjectModal";
import Header from "../../../components/ui/header";
import { Edit2, PlusSquare, Trash2 } from "lucide-react";
import { useAppSelector } from "../../../store/hooks";
import { format } from "date-fns";




export const ProjectListPage = () => {
  const { projects, fetchError: isError, isLoading } = useProject();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  



    if (isLoading) return <div>Loading...</div>;
  if (isError || !projects) return <div className="text-white">Error fetching members</div>;

  return (
    <div>
    {/* header */}
      <div className="px-4 xl:px-6">
         <NewProjectModal
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
        />
        
         <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header
          name="Projects"
          buttonComponent={
            <button
              className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewProjectOpen(true)}
            >
              <PlusSquare className="mr-2 h-5 w-5" /> New Project
            </button>
          }
        />
      </div>
      </div>
      
 <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={projects || []}
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

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Project Name", flex: 1 },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 150,
    valueFormatter: (params) => format(new Date(params), "dd MMM yyyy"),
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 150,
    valueFormatter: (params) => format(new Date(params), "dd MMM yyyy"),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(params.row)}
          className="rounded bg-yellow-500 px-2 py-1 text-sm text-white hover:bg-yellow-600"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => handleDelete(params.row.id)}
          className="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
  },
];


  const handleEdit = (project: any) => {
  console.log("Edit project:", project);
  // Open edit modal or navigate to edit page
};

const handleDelete = (projectId: string) => {
  console.log("Delete project:", projectId);
  // Show confirmation and trigger deletion logic
};