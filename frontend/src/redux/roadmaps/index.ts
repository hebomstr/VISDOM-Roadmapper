import { createSlice } from '@reduxjs/toolkit';
import {
  addOrPatchTaskrating,
  addRelatedtask,
  addRoadmap,
  addTask,
  addTaskrating,
  deleteRoadmap,
  deleteTask,
  deleteTaskrating,
  getPublicUsers,
  getRoadmaps,
  patchPublicUser,
  patchTask,
  patchTaskrating,
} from './actions';
import {
  ADD_RELATED_TASK_FULFILLED,
  ADD_ROADMAP_FULFILLED,
  ADD_TASKRATING_FULFILLED,
  ADD_TASK_FULFILLED,
  DELETE_ROADMAP_FULFILLED,
  DELETE_TASKRATING_FULFILLED,
  DELETE_TASK_FULFILLED,
  GET_PUBLIC_USERS_FULFILLED,
  GET_ROADMAPS_FULFILLED,
  PATCH_PUBLIC_USER_FULFILLED,
  PATCH_TASKRATING_FULFILLED,
  PATCH_TASK_FULFILLED,
  SELECT_CURRENT_ROADMAP,
} from './reducers';
import { RoadmapsState } from './types';

const initialState: RoadmapsState = {
  roadmaps: undefined,
  selectedRoadmapId: undefined,
  allUsers: undefined,
};

export const roadmapsSlice = createSlice({
  name: 'roadmaps',
  initialState,
  reducers: {
    selectCurrentRoadmap: SELECT_CURRENT_ROADMAP,
  },
  extraReducers: (builder) => {
    builder.addCase(getRoadmaps.fulfilled, GET_ROADMAPS_FULFILLED);
    builder.addCase(addRoadmap.fulfilled, ADD_ROADMAP_FULFILLED);
    builder.addCase(deleteRoadmap.fulfilled, DELETE_ROADMAP_FULFILLED);
    builder.addCase(addTask.fulfilled, ADD_TASK_FULFILLED);
    builder.addCase(deleteTask.fulfilled, DELETE_TASK_FULFILLED);
    builder.addCase(addTaskrating.fulfilled, ADD_TASKRATING_FULFILLED);
    builder.addCase(deleteTaskrating.fulfilled, DELETE_TASKRATING_FULFILLED);
    builder.addCase(addRelatedtask.fulfilled, ADD_RELATED_TASK_FULFILLED);
    builder.addCase(patchTask.fulfilled, PATCH_TASK_FULFILLED);
    builder.addCase(getPublicUsers.fulfilled, GET_PUBLIC_USERS_FULFILLED);
    builder.addCase(patchTaskrating.fulfilled, PATCH_TASKRATING_FULFILLED);
    builder.addCase(patchPublicUser.fulfilled, PATCH_PUBLIC_USER_FULFILLED);
  },
});

export const roadmapsActions = {
  ...roadmapsSlice.actions,
  addRelatedtask,
  deleteTaskrating,
  addTaskrating,
  deleteTask,
  addTask,
  deleteRoadmap,
  addRoadmap,
  getRoadmaps,
  getPublicUsers,
  patchTask,
  patchTaskrating,
  addOrPatchTaskrating,
  patchPublicUser,
};
