import React, { useState } from "react";
import Popover from "@mui/material/Popover";

import { Edit2, MoveVertical, Trash2 } from "lucide-react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Task } from "../../../types/state.type";
import { lazy, Suspense } from "react";
// import EditTaskModal from "../modals/EditTaskModal";
import ConfirmationDialog from "../popup/ConformationDialog";
import { toast } from "react-toastify";
import { useTasks } from "../../../features/task/useTask";
import TaskDrawer from "../drawers/TaskDrawer";

const EditTaskModal = lazy(() => import("../modals/EditTaskModal"));

type TaskSettingsPopOverProps = {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  task: Task;
};
const TaskSettingsPopOver: React.FC<TaskSettingsPopOverProps> = ({
  isOpen,
  anchorEl,
  onClose,
  task,
}) => {


  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    
      const { removeTask, deleteError, deleteLoading } = useTasks();
    
//     const toggleDrawer = (newOpen: boolean) => () => {
//         console.log(newOpen);
//     setViewDrawerOpen(newOpen);
//   };

  const options = [
    // {
    //   label: "View",
    //   icon: <MoveVertical fontSize="small" />,
    //   onClick:  toggleDrawer(!viewDrawerOpen),
    // },
    {
      label: "Edit",
      icon: <Edit2 fontSize="small" />,
      onClick: () => setEditModalOpen(true),
    },
    {
      label: "Delete",
      icon: <Trash2 fontSize="small" className="text-red-500" />,
      onClick: () => setConfirmDeleteOpen(true),
    },
  ];

    const confirmDelete = async (taskId:string ) => {
        if (!taskId) return;
    
        try {
            await removeTask(taskId);
        } catch (error) {
          toast.error("Unable to delete! Try again.");
        } finally {
          setConfirmDeleteOpen(false);
        }
      };

  return (
      <>
           {/* <TaskDrawer
        task={task}
        isDrawerOpen={viewDrawerOpen}
        toggleDrawer={toggleDrawer}
      /> */}


          <ConfirmationDialog
          isOpen={confirmDeleteOpen}
          title="Delete this meeting?"
          description="Are you sure you want to permanently delete this meeting? This action cannot be undone."
          onCancel={() => {
            setConfirmDeleteOpen(false);
            // setMeetingToDelete(null);
          }}
          onConfirm={()=>confirmDelete(task.id)}
        />
      <Suspense fallback={null}>
        <EditTaskModal
          isOpen={editModalOpen}
          initialData={task}
          onClose={() => setEditModalOpen(false)}
        />
      </Suspense>
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          className: "shadow-lg dark:bg-gray-600 dark:text-white ",
        }}
      >
        <List className="min-w-[150px]">
          {options.map((option) => (
            <ListItem
              button
              key={option.label}
              onClick={() => {
                option.onClick();
                onClose();
              }}
            >
              <ListItemIcon className="dark:text-zinc-800">
                {option.icon}
              </ListItemIcon>
              <ListItemText primary={option.label} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default TaskSettingsPopOver;
