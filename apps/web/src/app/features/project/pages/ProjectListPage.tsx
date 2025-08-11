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

import { useState } from "react";

import { useProject } from "../useProject";
import NewProjectModal from "../../../components/ui/modals/NewProjectModal";
import Header from "../../../components/ui/header";
import { Edit2, PlusSquare, Trash2 } from "lucide-react";
import { useAppSelector } from "../../../store/hooks";
import { format } from "date-fns";
import EditProjectModal from "../../../components/ui/modals/EditProjectModal";
import ConfirmationDialog from "../../../components/ui/popup/ConformationDialog";
import { toast } from "react-toastify";
import { Project } from "../../../../../../../libs/shared/types/src";

export const ProjectListPage = () => {
  const {
    projects,
    fetchError: isError,
    isLoading,
    deleteProject,
  } = useProject();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //

 const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      toast.success("Project deleted");
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
    }
  };

  const columns: GridColDef[] = [
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
        <div className="">
          <button
            onClick={() => {
              setSelectedProject(params.row);
              setIsEditModalOpen(true);
            }}
            className="rounded bg-yellow-500 px-2 py-1 text-sm text-white hover:bg-yellow-600 mx-2"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedProject(params.row);
              setIsDialogOpen(true);
            }}
            className="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError || !projects)
    return <div className="text-white">Error fetching members</div>;

  return (
    <>
      {/* header */}
      <div className="px-4 xl:px-6">
        <NewProjectModal
          isOpen={isModalNewProjectOpen}
          onClose={() => setIsModalNewProjectOpen(false)}
        />

        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={selectedProject}
        />

        <ConfirmationDialog
          isOpen={isDialogOpen}
          title="Delete Project?"
          description="Are you sure you want to delete this project? This cannot be undone."
          onCancel={() => setIsDialogOpen(false)}
          onConfirm={() => handleDelete(selectedProject?.id)}
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

      <div style={{  width: "100%" }} className="flex flex-1">
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
    </>
  );
};

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);
