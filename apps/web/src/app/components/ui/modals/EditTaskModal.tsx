import { formatISO, isBefore, parseISO, startOfDay } from "date-fns";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { useTasks } from "../../../features/task/useTask";
import { Priority, Status, Task } from "../../../types/state.type";
import { useMember } from "../../../features/organization/useMember";
import { Listbox } from "@headlessui/react";
import { User } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../../features/auth/useAuth";
import { getTaskSchema } from "../../../validations/taskSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData: Task;
};

const EditTaskModal = ({ isOpen, onClose, initialData }: Props) => {
  const { updateTask, updateLoading  } = useTasks();
  const { members, getAllMembers } = useMember();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  console.log("edit task");

  useEffect(() => {
    console.log(user?.id, initialData);
    if (user?.role === "organization") {
      getAllMembers({ page: 1, limit: 10 });
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status ?? null);
      setPriority(initialData.priority ?? null);
      setTags(initialData.tags || "");
      setStartDate(initialData.startDate?.split("T")[0] || "");
      setDueDate(initialData.endDate?.split("T")[0] || "");
      setAssignedUserId(initialData.assignee?.id || "");
    }
  }, [initialData]);
   const originalStartDate = initialData?.startDate?.split("T")[0];

  // const validate = () => {
  //   const errs: { [key: string]: string } = {};
  //   const now = startOfDay(new Date());

  //   if (!title.trim()) errs.title = "Title is required.";
  //   if (!description.trim()) errs.description = "Description is required.";
  //   if (!priority) errs.priority = "Priority is required.";
  //   if (!status) errs.status = "Status is required.";
  //   if (!assignedUserId) errs.assignedUserId = "Assignee is required.";

  //   // const originalStartDate = initialData?.startDate?.split("T")[0];


  //   const start = startDate ? startOfDay(parseISO(startDate)) : null;
  //   const end = dueDate ? startOfDay(parseISO(dueDate)) : null;

  //   // Start Date validation
  //   if (!startDate) {
  //     errs.startDate = "Start date is required.";
  //   } else if (
  //     startDate !== originalStartDate &&
  //     start &&
  //     isBefore(start, now)
  //   ) {
  //     errs.startDate = "Start date cannot be in the past.";
  //   }

  //   // Due Date validation
  //   if (!dueDate) {
  //     errs.dueDate = "Due date is required.";
  //   } else if (start && end && !isBefore(start, end)) {
  //     errs.dueDate = "Due date must be after start date.";
  //   }
  //   setErrors(errs);
  //   return Object.keys(errs).length === 0;
  // };



const validate = async (
  
) => {
  try {
    const schema = getTaskSchema(true, originalStartDate);
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

    try {
      await updateTask(initialData.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        tags: tags.trim(),
        startDate: formatISO(new Date(startDate)),
        endDate: formatISO(new Date(dueDate)),
        assignedUserId,
      });

      toast.success("Task updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task.");
    }
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const selectStyles =
    "mb-2 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const errorText = "text-sm text-red-500 mt-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Edit Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
      >
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status ?? ""}
            onChange={(e) => {
              setStatus(e.target.value as Status);
              setErrors((prev) => ({ ...prev, status: "" }));
            }}
          >
            <option value="">Select Status</option>
            {Object.values(Status).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.status && <p className={errorText}>{errors.status}</p>}

          <select
            className={selectStyles}
            value={priority ?? ""}
            onChange={(e) => {
              setPriority(e.target.value as Priority);
              setErrors((prev) => ({ ...prev, priority: "" }));
            }}
          >
            <option value="">Select Priority</option>
            {Object.values(Priority).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.priority && <p className={errorText}>{errors.priority}</p>}
        </div>

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setErrors((prev) => ({ ...prev, startDate: "" }));
            }}
          />
          {errors.startDate && <p className={errorText}>{errors.startDate}</p>}

          <input
            type="date"
            className={inputStyles}
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              setErrors((prev) => ({ ...prev, dueDate: "" }));
            }}
          />
          {errors.dueDate && <p className={errorText}>{errors.dueDate}</p>}
        </div>

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
                  ? members?.find((m) => m.id === assignedUserId)?.name
                  : "Select a member"}
              </Listbox.Button>
              <Listbox.Options className="absolute z-10 w-full bg-white border mt-1 max-h-60 overflow-auto">
                {members?.map((member) => (
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

        <button
          type="submit"
          className={`mt-4 flex w-full justify-center rounded-md bg-blue-primary px-4 py-2 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            updateLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={updateLoading}
        >
          {updateLoading ? "Saving..." : "Update Task"}
        </button>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
