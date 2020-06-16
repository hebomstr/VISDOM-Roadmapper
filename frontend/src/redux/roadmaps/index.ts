import { createSlice } from '@reduxjs/toolkit';
import { RoadmapsState } from './types';
import {
  getRoadmaps,
  addRoadmap,
  deleteRoadmap,
  addTask,
  deleteTask,
  addTaskrating,
  deleteTaskrating,
  addRelatedtask,
  patchTask,
  getPublicUsers,
  patchTaskrating,
  addOrPatchTaskrating,
} from './actions';
import {
  GET_ROADMAPS_FULFILLED,
  ADD_ROADMAP_FULFILLED,
  DELETE_ROADMAP_FULFILLED,
  ADD_TASK_FULFILLED,
  DELETE_TASK_FULFILLED,
  ADD_TASKRATING_FULFILLED,
  DELETE_TASKRATING_FULFILLED,
  ADD_RELATED_TASK_FULFILLED,
  SELECT_CURRENT_ROADMAP,
  PATCH_TASK_FULFILLED,
  GET_PUBLIC_USERS_FULFILLED,
  PATCH_TASKRATING_FULFILLED,
} from './reducers';

const initialState: RoadmapsState = {
  roadmaps: [],
  selectedRoadmapId: undefined,
  allUsers: [],
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
};
