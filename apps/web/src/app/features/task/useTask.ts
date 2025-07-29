

import {  TaskProps } from '../../../../../../libs/domain/entities/task.entity';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createTaskThunk, deleteTaskThunk, fetchTasksThunk, updateTaskThunk } from './taskSlice';






export function useTasks() {

  const {tasks,fetchError,createError,updateError, deleteError,fetchLoading,createLoading,updateLoading,deleteLoading}  = useAppSelector((state)=>state.task)
  const dispatch = useAppDispatch();

  const fetchTasks = async (filters: Partial<TaskProps> & { page: number, limit: number }) => {
    await dispatch(fetchTasksThunk(filters));
  };
  const createTask = async (data: Partial<TaskProps>) => {
    await dispatch(createTaskThunk(data)).unwrap();
  };

  const updateTask = async (taskId: string, data: Partial<TaskProps>) => {
    await dispatch(updateTaskThunk({ taskId, data })).unwrap();
  };

  const removeTask = async (taskId: string) => {
    await dispatch(deleteTaskThunk(taskId)).unwrap();
  };

  return {
    tasks,
    createError,
    fetchError,
    updateError,
    deleteError,
    fetchLoading,createLoading,updateLoading,deleteLoading,
    fetchTasks,
    createTask,
    updateTask,
    removeTask,
  };
}
