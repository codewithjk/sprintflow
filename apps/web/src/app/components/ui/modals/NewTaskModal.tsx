import { formatISO } from "date-fns";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useTasks } from "../../../features/task/useTask";
import { Priority, Status } from "../../../types/state.type";
import { useMember } from "../../../features/organization/useMember";
import { Listbox } from "@headlessui/react";
import { User } from "lucide-react";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const NewTaskModal = ({ isOpen, onClose, id = null }: Props) => {
  const {  createLoading, createTask, createError } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status | null> (null);
  const [priority, setPriority] = useState<Priority | null> (null);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  const { members, getAllMembers } = useMember();


  useEffect(() => {
    getAllMembers({ page: 1, limit: 10 });
  }, []);

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });

    try {
      await createTask({
        title,
        description,
        status,
        priority,
        tags,
        startDate: formattedStartDate,
        endDate: formattedDueDate,
        assignedUserId: assignedUserId,
        projectId: id !== null ? id : projectId,
      });
      toast.success("Task added successfully!");
      onClose();
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to add task.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags("");
    setStartDate("");
    setDueDate("");
    setAssignedUserId("");
  };

  const isFormValid = () => {
    // return !!title && (id !== null || !!projectId);
    return (
      !!title &&
      (id !== null || !!projectId) &&
      !!assignedUserId &&
      !!startDate &&
      !!dueDate &&
      !!priority &&
      !!status
    );
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status?? ""}
            onChange={(e) =>
              setStatus(e.target.value as Status)
            }
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority ??""}
            onChange={(e) =>
              setPriority(Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {members !== undefined && (
          <Listbox value={assignedUserId} onChange={setAssignedUserId}>
            <div className="relative">
              <Listbox.Button className="w-full border p-2 rounded dark:bg-dark-tertiary">
                {assignedUserId
                  ? members.find((m) => m.id === assignedUserId)?.name
                  : "Select a member"}
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 w-full bg-white border mt-1 max-h-60 overflow-auto">
                {members.map((member) => (
                  <Listbox.Option
                    key={member.id}
                    value={member.id}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {member.profileUrl ? (
                      <img
                        src={member.profileUrl}
                        alt={member.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                    <span>{member.name}</span>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        )}

        {id === null && (
          <input
            type="text"
            className={inputStyles}
            placeholder="ProjectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        )}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || createLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || createLoading}
        >
          {createLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default NewTaskModal;
