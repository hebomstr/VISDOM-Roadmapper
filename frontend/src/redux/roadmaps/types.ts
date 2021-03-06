import { UserType } from '../user/types';

export interface RoadmapsState {
  roadmaps: Roadmap[] | undefined;
  selectedRoadmapId?: number;
  allUsers: PublicUser[] | undefined;
}

export interface PublicUser {
  id: number;
  username: string;
  type: UserType;
  customerValue?: number;
}

export interface Roadmap {
  id: number;
  name: string;
  description: string;
  tasks: Task[];
}

export interface RoadmapRequest {
  id?: number;
  name?: string;
  description?: string;
  tasks?: Task[];
}

export interface Task {
  id: number;
  name: string;
  description: string;
  roadmapId: number;
  createdAt: string;
  completed: boolean;
  ratings: Taskrating[];
  relatedTasks: number[];
  createdByUser: number;
}

export interface TaskRequest {
  id?: number;
  name?: string;
  description?: string;
  completed?: boolean;
  roadmapId?: number;
  createdByUser?: number;
  relatedTasks?: TaskRequest[];
}

export enum TaskRatingDimension {
  BusinessValue = 0,
  RequiredWork = 1,
}

export interface Taskrating {
  id: number;
  dimension: TaskRatingDimension;
  value: number;
  comment: string;
  createdByUser: number;
  parentTask: number;
}

export interface TaskratingRequest {
  id?: number;
  dimension?: TaskRatingDimension;
  value?: number;
  comment?: string;
  createdByUser?: number;
  parentTask?: number;
}

export interface RelatedTaskRequest {
  fromTask: number;
  toTask: number;
}

export interface RelatedTaskResponsePayload {
  newRelatedTasks: number[];
  parentTaskId: number;
}

export interface PublicUserRequest {
  id?: number;
  username?: string;
  type?: UserType;
  customerValue?: number;
}
