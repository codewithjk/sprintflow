import { useEffect } from "react";

import { useTasks } from "../task/useTask";
import { socket } from "../../../utils/socket";


export function useSocketEvents() {
  const { createTask, updateTask, removeTask } = useTasks();

  useEffect(() => {
    socket.on("task:created", (task) => {
      createTask(task);
    });

    socket.on("task:updated", (task) => {
      updateTask(task.id, task);
    });

    socket.on("task:deleted", (taskId) => {
      removeTask(taskId);
    });

    return () => {
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:deleted");
    };
  }, []);
}
