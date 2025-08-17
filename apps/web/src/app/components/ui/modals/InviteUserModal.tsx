import { useState } from "react";
import Modal from "./Modal";
import { useInvitations } from "../../../features/organization/useInvitation";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const InviteUserModal = ({ isOpen, onClose }: Props) => {
  const { loading: isLoading, createInvitation } = useInvitations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const resetForm = () => {
    setName("");
    setEmail("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      newErrors.name = "Name is required.";
    } else if (trimmedName.length > 20) {
      newErrors.name = "Name must be less than 20 characters.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = "Invalid email format.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createInvitation({ name: name.trim(), email: email.trim() });
      toast.success("Invitation sent successfully.");
      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to send invitation.");
    }
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Invite New User">
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
            placeholder="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            className={inputStyles}
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Sending..." : "Send Invitation"}
        </button>
      </form>
    </Modal>
  );
};

export default InviteUserModal;
