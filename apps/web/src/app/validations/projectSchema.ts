// projectSchema.ts
import * as yup from "yup";
import { parseISO, startOfDay, isBefore } from "date-fns";

// Utility functions
const isDateInPast = (dateStr: string) => {
  const date = startOfDay(parseISO(dateStr));
  return isBefore(date, startOfDay(new Date()));
};

const isStartAfterEnd = (startStr: string, endStr: string) => {
  const start = startOfDay(parseISO(startStr));
  const end = startOfDay(parseISO(endStr));
  return !isBefore(start, end); // not before means invalid
};

// Schema generator
export const getProjectSchema = (isEditing: boolean) => {
  return yup.object().shape({
    projectName: yup
      .string()
      .trim()
      .required("Project name is required")
      .min(3, "Project name must be at least 3 characters")
      .max(100, "Project name must be less than 100 characters"),

    description: yup
      .string()
      .trim()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description is too long"),

    startDate: yup
      .string()
      .required("Start date is required")
      .test(
        "not-in-past",
        "Start date cannot be in the past",
        function (value) {
          if (isEditing) return true; // Skip check when editing
          return value ? !isDateInPast(value) : false;
        }
      ),

    endDate: yup
      .string()
      .required("End date is required")
      .test(
        "after-start",
        "End date must be after start date",
        function (value) {
          const { startDate } = this.parent;
          return value && startDate ? !isStartAfterEnd(startDate, value) : false;
        }
      ),
  });
};
