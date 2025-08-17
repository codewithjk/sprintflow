import { formatISO, isBefore, parseISO, startOfDay } from "date-fns";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useTasks } from "../../../features/task/useTask";
import { Priority, Status } from "../../../types/state.type";
import { useMember } from "../../../features/organization/useMember";
import { Listbox } from "@headlessui/react";
import { User } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../../features/auth/useAuth";
import { getTaskSchema } from "../../../validations/taskSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const NewTaskModal = ({ isOpen, onClose, id = null }: Props) => {
  const { createLoading, createTask } = useTasks();
  const { user,} = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { members, getAllMembers } = useMember();

  useEffect(() => {
    if(user?.role === "organization")getAllMembers({ page: 1, limit: 10 });
  }, []);

  // const validate = () => {
  //   const errs: { [key: string]: string } = {};
  //   const now = startOfDay(new Date());

  //   if (!title.trim()) errs.title = "Title is required.";
  //   if (!description.trim()) errs.description = "Description is required.";
  //   if (!priority) errs.priority = "Priority is required.";
  //   if (!status) errs.status = "Status is required.";
  //   if (!assignedUserId) errs.assignedUserId = "Assignee is required.";

  //   if (id === null && !projectId.trim())
  //     errs.projectId = "Project ID is required.";

  //   if (!startDate) {
  //     errs.startDate = "Start date is required.";
  //   } else {
  //     const start = startOfDay(parseISO(startDate));
  //     if (isBefore(start, now)) {
  //       errs.startDate = "Start date cannot be in the past.";
  //     }
  //   }

  //   if (!dueDate) {
  //     errs.dueDate = "Due date is required.";
  //   } else if (startDate) {
  //     const start = startOfDay(parseISO(startDate));
  //     const end = startOfDay(parseISO(dueDate));
  //     if (!isBefore(start, end)) {
  //       errs.dueDate = "Due date must be after start date.";
  //     }
  //   }

  //   setErrors(errs);
  //   return Object.keys(errs).length === 0;
  // };

const validate = async (
  
) => {
  try {
    const schema = getTaskSchema(false);
    await schema.validate({
    title,
    description,
    status,
    priority,
    tags,
    assignedUserId,
    startDate,
    dueDate,
  }, { abortEarly: false });
    setErrors({});
    return true;
  } catch (err: any) {
    const validationErrors: Record<string, string> = {};
    if (err.inner) {
      err.inner.forEach((e: any) => {
        if (e.path) validationErrors[e.path] = e.message;
      });
    }
    setErrors(validationErrors);
    return false;
  }
};

  const handleSubmit = async () => {
    if (! await validate()) return;

    const formattedStartDate = formatISO(new Date(startDate));
    const formattedDueDate = formatISO(new Date(dueDate));

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        tags: tags.trim(),
        startDate: formattedStartDate,
        endDate: formattedDueDate,
        assignedUserId,
        projectId: id ?? projectId,
      });

      toast.success("Task added successfully!");
      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to add task.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags("");
    setStartDate("");
    setDueDate("");
    setAssignedUserId("");
    setStatus(null);
    setPriority(null);
    setProjectId("");
    setErrors({});
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const selectStyles =
    "mb-2 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const errorText = "text-sm text-red-500 mt-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
      >
        {/* Title */}
        <div>
          <input
            type="text"
            className={inputStyles}
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
          />
          {errors.title && <p className={errorText}>{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <textarea
            className={inputStyles}
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
          />
          {errors.description && (
            <p className={errorText}>{errors.description}</p>
          )}
        </div>

        {/* Status + Priority */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <select
              className={selectStyles}
              value={status ?? ""}
              onChange={(e) => {
                setStatus(e.target.value as Status);
                setErrors((prev) => ({ ...prev, status: "" }));
              }}
            >
              <option value="">Select Status</option>
              <option value={Status.ToDo}>To Do</option>
              <option value={Status.WorkInProgress}>Work In Progress</option>
              <option value={Status.UnderReview}>Under Review</option>
              <option value={Status.Completed}>Completed</option>
            </select>
            {errors.status && <p className={errorText}>{errors.status}</p>}
          </div>

          <div>
            <select
              className={selectStyles}
              value={priority ?? ""}
              onChange={(e) => {
                setPriority(
                  Priority[e.target.value as keyof typeof Priority]
                );
                setErrors((prev) => ({ ...prev, priority: "" }));
              }}
            >
              <option value="">Select Priority</option>
              <option value={Priority.Urgent}>Urgent</option>
              <option value={Priority.High}>High</option>
              <option value={Priority.Medium}>Medium</option>
              <option value={Priority.Low}>Low</option>
              <option value={Priority.Backlog}>Backlog</option>
            </select>
            {errors.priority && <p className={errorText}>{errors.priority}</p>}
          </div>
        </div>

        {/* Tags */}
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
            setErrors((prev) => ({ ...prev, tags: "" }));
          }}
        />
        {errors.tags && <p className={errorText}>{errors.tags}</p>}

        {/* Dates */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <input
              type="date"
              className={inputStyles}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setErrors((prev) => ({ ...prev, startDate: "" }));
              }}
            />
            {errors.startDate && (
              <p className={errorText}>{errors.startDate}</p>
            )}
          </div>
          <div>
            <input
              type="date"
              className={inputStyles}
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setErrors((prev) => ({ ...prev, dueDate: "" }));
              }}
            />
            {errors.dueDate && (
              <p className={errorText}>{errors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Member Selector */}
        {members !== undefined && (
          <div>
            <Listbox
              value={assignedUserId}
              onChange={(value) => {
                setAssignedUserId(value);
                setErrors((prev) => ({ ...prev, assignedUserId: "" }));
              }}
            >
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
            {errors.assignedUserId && (
              <p className={errorText}>{errors.assignedUserId}</p>
            )}
          </div>
        )}

        {/* Optional Project ID Input */}
        {id === null && (
          <div>
            <input
              type="text"
              className={inputStyles}
              placeholder="Project ID"
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setErrors((prev) => ({ ...prev, projectId: "" }));
              }}
            />
            {errors.projectId && (
              <p className={errorText}>{errors.projectId}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          className={`mt-4 flex w-full justify-center rounded-md bg-blue-primary px-4 py-2 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            createLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={createLoading}
        >
          {createLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default NewTaskModal;
