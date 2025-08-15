import { format } from "date-fns";
import Image from "../images";
import { Task } from "../../../types/state.type";
import { User } from "lucide-react";
import TaskDrawer from "../drawers/TaskDrawer";
import { useState } from "react";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  const taskTagsSplit = task.tags ? task.tags.split(",") : [];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
     console.log(newOpen)
    setDrawerOpen(newOpen);
  };

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "Not set";
  const formattedDueDate = task.endDate
    ? format(new Date(task.endDate), "P")
    : "Not set";

  const PriorityTag = ({ priority }: { priority: Task["priority"] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
          ? "bg-yellow-200 text-yellow-700"
          : priority === "Medium"
          ? "bg-green-200 text-green-700"
          : priority === "Low"
          ? "bg-blue-200 text-blue-700"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );

  

  return (
    <div
      onClick={toggleDrawer(!drawerOpen)}
      className="mb-4 overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-dark-secondary dark:text-white"
    >
      <TaskDrawer
        task={task}
        isDrawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
      />
      {task.attachments?.length > 0 && (
        <Image
          src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full object-cover"
        />
      )}

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex flex-wrap gap-2">
              {taskTagsSplit.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Title & Dates */}
        <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-bold">{task.title}</h3>
          <div className="text-sm text-gray-500 dark:text-neutral-400">
            {formattedStartDate} - {formattedDueDate}
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-gray-600 dark:text-neutral-400">
          {task.description || "No description provided"}
        </p>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Footer */}
        <div className="mt-4 flex  justify-between">
          <div className="flex  justify-between -space-x-2 overflow-hidden  w-full">
            <div className="flex gap-3 items-center">
              <p>Assigned To : </p>
              {task.assignee && task.assignee?.profileUrl ? (
                <Image
                  src={task.assignee.profileUrl}
                  alt={task.assignee.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              ) : (
                <>
                  <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
                  <span> {task.assignee?.name}</span>
                </>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <p>Author : </p>
              {task.author && task.author.profileUrl ? (
                <Image
                  src={task.author.profileUrl}
                  alt={task.author.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              ) : (
                <>
                  <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
                  <span> {task.author?.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
