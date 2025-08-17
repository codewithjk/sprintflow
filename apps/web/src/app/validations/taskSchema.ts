// validation/taskSchema.ts
import * as yup from "yup";
import { isBefore, parseISO, startOfDay } from "date-fns";
import { Priority, Status } from "../types/state.type";


export const getTaskSchema = (
  isEdit: boolean,
  originalStartDate?: string
) => {
  return yup.object().shape({
    title: yup
      .string()
      .trim()
      .required("Title is required.")
      .min(3, "Title must be at least 3 characters"),

    description: yup
      .string()
      .trim()
      .required("Description is required.")
      .min(10, "Description must be at least 10 characters"),

    status: yup
      .mixed<Status>()
      .oneOf(Object.values(Status))
      .required("Status is required."),

    priority: yup
      .mixed<Priority>()
      .oneOf(Object.values(Priority))
      .required("Priority is required."),

    tags: yup
  .string()
  .optional()
  .test(
    "valid-tags",
    "Tags must be a comma-separated list of alphabetic words (max 10 tags).",
    function (value) {
      if (!value || value.trim() === "") return true; // optional field

      const tags = value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (tags.length > 10) return false;

      const alphaOnly = /^[a-zA-Z]+$/;

      return tags.every((tag) => alphaOnly.test(tag));
    }
  ),


    assignedUserId: yup.string().required("Assignee is required."),

   

    startDate: yup
      .string()
      .required("Start date is required.")
      .test(
        "not-in-past",
        "Start date cannot be in the past.",
        function (value) {
          if (!value) return false;

          const start = startOfDay(parseISO(value));
          const now = startOfDay(new Date());

          // Skip this validation if in edit mode and date is unchanged
          if (
            isEdit &&
            originalStartDate &&
            value === originalStartDate
          ) {
            return true;
          }

          return !isBefore(start, now);
        }
      ),

    dueDate: yup
      .string()
      .required("Due date is required.")
      .test(
        "after-start-date",
        "Due date must be after start date.",
        function (value) {
          const { startDate } = this.parent;
          if (!value || !startDate) return false;

          const start = startOfDay(parseISO(startDate));
          const due = startOfDay(parseISO(value));

          return isBefore(start, due);
        }
      ),
  });
};
