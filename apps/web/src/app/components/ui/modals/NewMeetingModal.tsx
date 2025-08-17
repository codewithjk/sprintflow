import { useState } from "react";
import Modal from "./Modal";
import { MeetingProps } from "../../../../../../../libs/domain/entities/meeting.entity";
import { isBefore, parseISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<MeetingProps>) => void;
  isLoading?: boolean;
};

const NewMeetingModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: Props) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    subject: "",
    startDate: "",
    endDate: "",
  });

  const resetForm = () => {
    setName("");
    setSubject("");
    setStartDate("");
    setEndDate("");
    setErrors({
      name: "",
      subject: "",
      startDate: "",
      endDate: "",
    });
  };

 const validate = () => {
  const newErrors = {
    name: "",
    subject: "",
    startDate: "",
    endDate: "",
  };

  const trimmedName = name.trim();
  const trimmedSubject = subject.trim();
  const now = new Date();

  if (!trimmedName) {
    newErrors.name = "Meeting name is required.";
  }
   if (trimmedName.length > 30) {
     newErrors.name = "Meeting name should be less than 30 character."
   }

  if (!trimmedSubject) {
    newErrors.subject = "Subject is required.";
  }
    if (trimmedName.length > 250) {
     newErrors.subject = "Meeting name should be less than 250 character."
   }

  if (!startDate) {
    newErrors.startDate = "Start date and time is required.";
  }

  if (!endDate) {
    newErrors.endDate = "End date and time is required.";
  }

  if (startDate && endDate) {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (isBefore(start, now)) {
      newErrors.startDate = "Start time must be in the future.";
    }

    if (!isBefore(start, end)) {
      newErrors.endDate = "End time must be after start time.";
    }

    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours >= 24) {
      newErrors.endDate = "Meeting duration must be less than 24 hours.";
    }
  }

  setErrors(newErrors);
  return Object.values(newErrors).every((e) => e === "");
};


  const handleSubmit = () => {
    if (!validate()) return;

    const meeting: Partial<MeetingProps> = {
      name: name.trim(),
      subject: subject.trim(),
      startTime: new Date(startDate),
      endTime: new Date(endDate),
    };

    onSubmit(meeting);
    resetForm();
    onClose();
  };

  const inputClass =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const errorTextClass = "text-sm text-red-500 mt-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Meeting">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="mt-4 space-y-4"
        noValidate
      >
        <div>
          <input
            type="text"
            className={inputClass}
            placeholder="Meeting Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: "" }));
            }}
          />
          {errors.name && <p className={errorTextClass}>{errors.name}</p>}
        </div>

        <div>
          <input
            type="text"
            className={inputClass}
            placeholder="Subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setErrors((prev) => ({ ...prev, subject: "" }));
            }}
          />
          {errors.subject && <p className={errorTextClass}>{errors.subject}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="datetime-local"
              className={inputClass}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setErrors((prev) => ({ ...prev, startDate: "" }));
              }}
            />
            {errors.startDate && (
              <p className={errorTextClass}>{errors.startDate}</p>
            )}
          </div>

          <div>
            <input
              type="datetime-local"
              className={inputClass}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setErrors((prev) => ({ ...prev, endDate: "" }));
              }}
            />
            {errors.endDate && (
              <p className={errorTextClass}>{errors.endDate}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`mt-4 w-full rounded-md bg-blue-primary px-4 py-2 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {isLoading ? "Creating..." : "Create Meeting"}
        </button>
      </form>
    </Modal>
  );
};

export default NewMeetingModal;
