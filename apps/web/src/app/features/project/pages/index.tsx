import Board from "./BoardView";
import List from "./ListView";
import Timeline from "./TimeLineView";

import Table from "./TableView";

import { useEffect, useState } from "react";
import ProjectHeader from "./ProjectHeader";
import NewTaskModal from "../../../components/ui/modals/NewTaskModal";
import { Navigate, useParams } from "react-router-dom";
import { isValidObjectId } from "../../../../utils/validation";
import { useTasks } from "../../task/useTask";
import Header from "../../../components/ui/header";
import { PlusSquare } from "lucide-react";
import { useProject } from "../useProject";

export const ProjectViewPage = () => {
  const { id } = useParams<{ id: string }>();
  if (id === undefined || !isValidObjectId(id)) {
    return <Navigate to="/error" replace />;
  }
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const { fetchTasks } = useTasks();
  console.log(id);
  const { project, getProjectById } = useProject();
  useEffect(() => {
    fetchTasks({ projectId: id, page: 1, limit: 10 });
    getProjectById(id);
  }, [id]);
  if (!project) {
    return <div className="text-white">failed to Loading project...</div>; // or a spinner component
  }
  return (
    <div>
      <div className="px-4 xl:px-6">
        <NewTaskModal
          isOpen={isModalNewTaskOpen}
          onClose={() => setIsModalNewTaskOpen(false)}
          id={id}
        />
        <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
          <Header
            name={project.name}
            buttonComponent={
              <button
                className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                onClick={() => setIsModalNewTaskOpen(true)}
              >
                <PlusSquare className="mr-2 h-5 w-5" /> New Tasks
              </button>
            }
          />
        </div>
      </div>
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "Board" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "List" && (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Timeline" && (
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
      {activeTab === "Table" && (
        <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
};
