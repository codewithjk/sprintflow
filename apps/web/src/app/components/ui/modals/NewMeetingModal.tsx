import { useState } from "react";
import Modal from "./Modal";
import { MeetingProps } from "../../../../../../../libs/domain/entities/meeting.entity";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<MeetingProps>) => void;
  isLoading?: boolean;
};

const NewMeetingModal = ({ isOpen, onClose, onSubmit, isLoading = false }: Props) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const resetForm = () => {
    setName("");
    setSubject("");
    setStartDate("");
    setEndDate("");
  };

  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      subject.trim() !== "" &&
      startDate !== "" &&
      endDate !== "" &&
      new Date(startDate) <= new Date(endDate)
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    const meeting: Partial<MeetingProps> = {
      name,
      subject,
      startTime: new Date(startDate),
      endTime: new Date(endDate),
    };

    onSubmit(meeting);
    resetForm();
    onClose();
  };

  const inputClass =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Meeting">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="mt-4 space-y-4"
      >
        <input
          type="text"
          className={inputClass}
          placeholder="Meeting Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className={inputClass}
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="datetime-local"
            className={inputClass}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="datetime-local"
            className={inputClass}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className={`mt-4 w-full rounded-md bg-blue-primary px-4 py-2 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Creating..." : "Create Meeting"}
        </button>
      </form>
    </Modal>
  );
};

export default NewMeetingModal;
