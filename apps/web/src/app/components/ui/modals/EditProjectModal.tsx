import { useEffect, useState } from "react";
import { formatISO, parseISO } from "date-fns";
import Modal from "./Modal";
import { useProject } from "../../../features/project/useProject";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
};

const EditProjectModal = ({ isOpen, onClose, initialData }: Props) => {
  const { updateProject ,updateLoading} = useProject();

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        startDate: initialData.startDate
          ? initialData.startDate.split("T")[0]
          : "",
        endDate: initialData.endDate ? initialData.endDate.split("T")[0] : "",
      });
    }
    setErrors({});
  }, [isOpen,initialData]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name) errs.name = "Project name is required";
    if (!form.description) errs.description = "Description is required";
    if (!form.startDate) errs.startDate = "Start date is required";
    if (!form.endDate) errs.endDate = "End date is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await updateProject(initialData.id, {
        name: form.name,
        description: form.description,
        startDate: formatISO(new Date(form.startDate)),
        endDate: formatISO(new Date(form.endDate)),
      });

      toast.success("Project updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project.");
    }
  };

  const inputStyles =
    "w-full border px-3 py-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Edit Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            name="name"
            className={inputStyles}
            value={form.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            className={inputStyles}
            value={form.description}
            onChange={handleInputChange}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              className={inputStyles}
              value={form.startDate}
              onChange={handleInputChange}
            />
            {errors.startDate && (
              <p className="text-xs text-red-500">{errors.startDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              className={inputStyles}
              value={form.endDate}
              onChange={handleInputChange}
            />
            {errors.endDate && (
              <p className="text-xs text-red-500">{errors.endDate}</p>
            )}
          </div>
        </div>

        <button
           disabled={ updateLoading}
          type="submit"
          className={`mt-4 w-full bg-blue-primary text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 ${
             updateLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
            {updateLoading ? "Saving..." : "Save"}
        </button>
      </form>
    </Modal>
  );
};

export default EditProjectModal;
