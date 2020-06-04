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
} from './reducers';

const initialState: RoadmapsState = {
  roadmaps: [],
};

export const roadmapsSlice = createSlice({
  name: 'roadmaps',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoadmaps.fulfilled, GET_ROADMAPS_FULFILLED);
    builder.addCase(addRoadmap.fulfilled, ADD_ROADMAP_FULFILLED);
    builder.addCase(deleteRoadmap.fulfilled, DELETE_ROADMAP_FULFILLED);
    builder.addCase(addTask.fulfilled, ADD_TASK_FULFILLED);
    builder.addCase(deleteTask.fulfilled, DELETE_TASK_FULFILLED);
    builder.addCase(addTaskrating.fulfilled, ADD_TASKRATING_FULFILLED);
    builder.addCase(deleteTaskrating.fulfilled, DELETE_TASKRATING_FULFILLED);
    builder.addCase(addRelatedtask.fulfilled, ADD_RELATED_TASK_FULFILLED);
  },
});