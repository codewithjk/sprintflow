import {  useState } from "react";
import { formatISO } from "date-fns";
import Modal from "./Modal";
import { useProject } from "../../../features/project/useProject";
import { toast } from "react-toastify";
import { getProjectSchema } from "../../../validations/projectSchema";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const NewProjectModal = ({ isOpen, onClose }: Props) => {
  const { createProject, createLoading } = useProject();

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


    const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const validate = async () => {
  try {
    const schema = getProjectSchema(false);
    await schema.validate( {
     projectName,
    description,
    startDate,
    endDate,
  }, { abortEarly: false });
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
  const handleSubmit = async () => {
    if (! await validate()) return;

    try {
      const formattedStartDate = formatISO(new Date(startDate));
      const formattedEndDate = formatISO(new Date(endDate));

      await createProject({
        name: projectName.trim(),
        description: description.trim(),
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });

      toast.success("Project created successfully!");
      onClose();
      resetForm();
    } catch (err: any) {
      toast.error(err || "Failed to create project.");
    }
  };

  const resetForm = () => {
    setProjectName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setErrors({
      projectName: "",
      description: "",
      startDate: "",
      endDate: "",
    });
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const errorStyles = "text-sm text-red-500 mt-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
      >
        <div>
          <input
            type="text"
            className={inputStyles}
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          {errors.projectName && <p className={errorStyles}>{errors.projectName}</p>}
        </div>

        <div>
          <textarea
            className={inputStyles}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <p className={errorStyles}>{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]} 
              className={inputStyles}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            {errors.startDate && <p className={errorStyles}>{errors.startDate}</p>}
          </div>

          <div>
            <input
              type="date"
              className={inputStyles}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {errors.endDate && <p className={errorStyles}>{errors.endDate}</p>}
          </div>
        </div>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            createLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={createLoading}
        >
          {createLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default NewProjectModal;
