
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Priority, Task } from "../../../types/state.type";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import NewTaskModal from "../../../components/ui/modals/NewTaskModal";
import Header from "../../../components/ui/header";
import TaskCard from "../../../components/ui/cards/TaskCard";
import { useAuth } from "../../auth/useAuth";
import { useTasks } from "../useTask";
import { dataGridClassNames, dataGridSxStyles } from "../../../../utils/dataGridStyles";



type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "endDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value.name || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value.name || "Unassigned",
  },
];

export const PriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

    const { user: currentUser } = useAuth();
    
  const { tasks, fetchLoading, fetchError, fetchTasks } = useTasks();
  console.log(tasks)
    
    //fetching tasks for user or organization
    useEffect(() => {
        if (currentUser?.role === "user") {
            fetchTasks({ assignedUserId: currentUser.id, page: 1, limit: 10 })
        } else if (currentUser?.role === "organization") {
            fetchTasks({ orgId: currentUser.id, page: 1, limit: 10 });
        }
    }, []);
    console.log(currentUser)

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter(
    (task: Task) => task.priority === priority,
  );

  if (fetchError || !tasks) return <div>Error fetching tasks</div>;

  return (
    <div className="m-5 p-4">
      <NewTaskModal
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
      />
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 ${
            view === "list" ? "bg-gray-300" : "bg-white"
          } rounded-l`}
          onClick={() => setView("list")}
        >
          List
        </button>
        <button
          className={`px-4 py-2 ${
            view === "table" ? "bg-gray-300" : "bg-white"
          } rounded-l`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>
      {fetchLoading ? (
        <div>Loading tasks...</div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredTasks?.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        view === "table" &&
        filteredTasks && (
          <div className="z-0 w-full">
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        )
      )}
    </div>
  );
};

