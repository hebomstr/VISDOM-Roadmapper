import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import {
  FullHeightRow,
  PaddinglessCol,
} from '../components/CommonLayoutComponents';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SideBar } from '../components/SideBar';
import { TaskListPage } from '../pages/TaskListPage';
import { VisualizationPage } from '../pages/VisualizationPage';
import { StoreDispatchType } from '../redux';
import { roadmapsActions } from '../redux/roadmaps';
import { chosenRoadmapSelector } from '../redux/roadmaps/selectors';
import { Roadmap } from '../redux/roadmaps/types';
import { RootState } from '../redux/types';
import { paths } from './paths';

const routes = [
  {
    path: paths.roadmapRelative.taskList,
    component: TaskListPage,
  },
  { path: paths.roadmapRelative.visualize, component: VisualizationPage },
];

export const RoadmapRouter = () => {
  const { path } = useRouteMatch();
  const { roadmapId } = useParams();
  const dispatch = useDispatch<StoreDispatchType>();
  const currentRoadmap = useSelector<RootState, Roadmap | undefined>(
    chosenRoadmapSelector,
    shallowEqual,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [useEffectFinished, setUseEffectFinished] = useState(false);

  useEffect(() => {
    dispatch(roadmapsActions.selectCurrentRoadmap(+roadmapId));
    if (!currentRoadmap) {
      setIsLoading(true);
      dispatch(roadmapsActions.getRoadmaps()).then(() => {
        setIsLoading(false);
      });
    }
    setUseEffectFinished(true);
  }, [currentRoadmap, roadmapId, dispatch]);

  const renderOrRedirect = () => {
    if (!useEffectFinished) return;
    if (!isLoading && !currentRoadmap)
      return (
        <>
          <FullHeightRow>
            <Col>Roadmap not found!</Col>
          </FullHeightRow>
        </>
      );
    if (!isLoading) {
      return (
        <FullHeightRow>
          <SideBar />
          <PaddinglessCol className="h-100">
            <Switch>
              {routes.map((route) => (
                <Route
                  key={path + route.path}
                  path={path + route.path}
                  component={route.component}
                />
              ))}
            </Switch>
          </PaddinglessCol>
        </FullHeightRow>
      );
    }
    return <LoadingSpinner />;
  };
  return <>{renderOrRedirect()}</>;
};