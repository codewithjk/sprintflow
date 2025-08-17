import { useEffect, useState } from "react";
import { formatISO,  } from "date-fns";
import Modal from "./Modal";
import { useProject } from "../../../features/project/useProject";
import { toast } from "react-toastify";
import { getProjectSchema } from "../../../validations/projectSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
};

const EditProjectModal = ({ isOpen, onClose, initialData }: Props) => {
  const { updateProject, updateLoading } = useProject();

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
  }, [isOpen, initialData]);

  const validate = async () => {
  try {
    const schema = getProjectSchema(true);
    await schema.validate(form, { abortEarly: false });
    setErrors({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
  });
    return true;
  } catch (err: any) {
    const newErrors: Record<string, string> = {};
    err.inner.forEach((e: any) => {
      if (e.path) newErrors[e.path] = e.message;
    });
    setErrors(newErrors);
    return false;
  }
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
        name: form.name.trim(),
        description: form.description.trim(),
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
  const errorStyles = "text-xs text-red-500 mt-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Edit Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
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
          {errors.name && <p className={errorStyles}>{errors.name}</p>}
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
            <p className={errorStyles}>{errors.description}</p>
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
              <p className={errorStyles}>{errors.startDate}</p>
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
              <p className={errorStyles}>{errors.endDate}</p>
            )}
          </div>
        </div>

        <button
          disabled={updateLoading}
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
