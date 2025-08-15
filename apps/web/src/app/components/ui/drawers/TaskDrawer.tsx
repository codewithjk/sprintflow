import Drawer from '@mui/material/Drawer';
import { format } from 'date-fns';
import Image from '../images';
import { Task } from '../../../types/state.type';
import { User } from 'lucide-react';

type TaskDrawerProps = {
  task: Task;
  isDrawerOpen: boolean;
  toggleDrawer: (state: boolean) => void;
};

function TaskDrawer({ task, isDrawerOpen, toggleDrawer }: TaskDrawerProps) {
  const taskTagsSplit = task.tags ? task.tags.split(',') : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), 'P')
    : 'Not set';
  const formattedDueDate = task.endDate
    ? format(new Date(task.endDate), 'P')
    : 'Not set';

  const PriorityTag = ({ priority }: { priority: Task['priority'] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        priority === 'Urgent'
          ? 'bg-red-200 text-red-700'
          : priority === 'High'
          ? 'bg-yellow-200 text-yellow-700'
          : priority === 'Medium'
          ? 'bg-green-200 text-green-700'
          : priority === 'Low'
          ? 'bg-blue-200 text-blue-700'
          : 'bg-gray-200 text-gray-700'
      }`}
    >
      {priority}
    </div>
  );
    
    
  return (
    <Drawer
      anchor="bottom"
      open={isDrawerOpen}
      onClose={()=>toggleDrawer(false)}
      PaperProps={{
        className:
          'max-h-[90vh] overflow-y-auto rounded-t-xl p-4 md:p-6 bg-white dark:bg-dark-secondary',
      }}
    >
      {/* Task Image */}
      {task.attachments?.length > 0 && (
        <Image
          src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full object-cover rounded-md"
        />
      )}

      {/* Task Header */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {task.priority && <PriorityTag priority={task.priority} />}
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

      {/* Title & Dates */}
      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h3 className="text-xl font-bold">{task.title}</h3>
        <div className="text-sm text-gray-500 dark:text-neutral-400">
          {formattedStartDate} - {formattedDueDate}
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-600 dark:text-neutral-400">
        {task.description || 'No description provided'}
      </p>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      {/* Footer - Assignee and Author */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <p className="font-medium">Assigned To:</p>
          {task.assignee?.profileUrl ? (
            <>
              <Image
                src={task.assignee.profileUrl}
                alt={task.assignee.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border-2 object-cover dark:border-dark-secondary"
              />
              <span>{task.assignee.name}</span>
            </>
          ) : (
            <>
              <User className="h-6 w-6 rounded-full dark:text-white" />
              <span>{task.assignee?.name || 'Unassigned'}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <p className="font-medium">Author:</p>
          {task.author?.profileUrl ? (
            <>
              <Image
                src={task.author.profileUrl}
                alt={task.author.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border-2 object-cover dark:border-dark-secondary"
              />
              <span>{task.author.name}</span>
            </>
          ) : (
            <>
              <User className="h-6 w-6 rounded-full dark:text-white" />
              <span>{task.author?.name || 'Unknown'}</span>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export default TaskDrawer;




