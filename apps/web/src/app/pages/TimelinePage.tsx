import { useEffect } from "react";
import Header from "../components/ui/header";
import { useAuth } from "../features/auth/useAuth";
import Timeline from "../features/project/pages/TimeLineView";
import { NotFoundPage } from "./NotFoundPage";
import { useTasks } from "../features/task/useTask";

export function TimeLinePage() {
  const { user } = useAuth();

  const { fetchTasks, fetchLoading, fetchError } = useTasks();
  const userId = user?.id;
  useEffect(() => {
    fetchTasks({ assignedUserId: userId, page: 1, limit: 10 });
  }, [userId]);
  if (!userId) return <NotFoundPage />;
  if (fetchError)
    return <div className="text-red-500"> Error in loading tasks</div>;
  return (
    <div className="flex w-full h-full flex-col  ">
      <Header name="Timeline" isSmallText />

      <Timeline id="" setIsModalNewTaskOpen={() => false} />
    </div>
  );
}
