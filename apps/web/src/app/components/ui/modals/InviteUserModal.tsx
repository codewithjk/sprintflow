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

  const handleSubmit = async () => {
  if (!name.trim() || !email.trim()) return;

  try {
    await createInvitation({ name, email });
    toast.success("Invitation sent"); // ✅ show success toast
    setName("");
    setEmail("");
    onClose();
  } catch (err: any) {
    toast.error(err.message || "Failed to send invitation"); // ✅ use caught error
  }
};
  const isFormValid = () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return name.trim() !== "" && isEmailValid;
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
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className={inputStyles}
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Sending..." : "Send Invitation"}
        </button>
      </form>
    </Modal>
  );
};

export default InviteUserModal;
