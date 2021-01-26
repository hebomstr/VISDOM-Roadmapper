import JiraApi from 'jira-client';
import { RouteHandlerFnc } from '../../types/customTypes';
import {
  authorizationURL,
  swapOAuthToken,
} from '../../utils/jiraauthentication';
import { jiraApi } from '../../utils/jiraclient';
import JiraConfiguration from '../jiraconfigurations/jiraconfigurations.model';
import Roadmap from '../roadmaps/roadmaps.model';
import Task from '../tasks/tasks.model';
import Token from '../tokens/tokens.model';
import User from '../users/users.model';

const buildJiraClientForRoadmap = (jiraconfig: JiraConfiguration, user: User) => {
  const requestToken = user.tokens.find((token) => {
    return token.provider === 'jira' && token.type === 'Bearer' && token.instance === jiraconfig.url;
  });
  if(!requestToken) {
    throw "Missing Jira request token.";
  }

  return new JiraApi({
    protocol: 'https',
    host: jiraconfig.url,
    apiVersion: '2',
    strictSSL: true,
    bearer: requestToken.value,
  });
};

export const getBoards: RouteHandlerFnc = async (ctx, _) => {
  const roadmapId = ctx.params.id;
  const roadmap = await Roadmap.query().withGraphFetched('[jiraconfiguration]').findById(roadmapId);
  if(!roadmap || !roadmap.jiraconfiguration) {
    throw "Missing Roadmap or JiraConfiguration.";
  }

  const user = await User.query().withGraphFetched('[tokens]').findById(parseInt(ctx.state.user.id, 10));

  const jiraApi = buildJiraClientForRoadmap(roadmap.jiraconfiguration, user);
  const boards = await jiraApi.getAllBoards();
  ctx.body = boards.values.map((board: any) => {
    return {
      id: board.id,
      name: board.name,
    };
  });
};

export const importBoard: RouteHandlerFnc = async (ctx, _) => {
  const { boardId, roadmapId, createdByUser } = ctx.request.body;
  const boardissues = await jiraApi.getIssuesForBoard(boardId);
  const issueIds = boardissues.issues.map((issue: any) => issue.id);
  const issues = await Promise.all(
    issueIds.map(async (id: any) => await jiraApi.findIssue(id)),
  );
  const importedTasks: Task[] = [];
  for (let issue of issues) {
    const convertedIssue = issue as any;
    const task = {
      name: convertedIssue.fields.summary,
      description: convertedIssue.fields.description || 'No description',
      createdAt: convertedIssue.fields.created,
      completed: false,
      jiraId: parseInt(convertedIssue.id, 10),
      createdByUser: createdByUser,
      roadmapId: roadmapId,
    };
    const existing = await Task.query()
      .where('jiraId', parseInt(convertedIssue.id, 10))
      .first();
    if (existing) {
      const imported = await Task.query().patchAndFetchById(existing.id, task);
      importedTasks.push(imported);
    } else {
      const imported = await Task.query().insert(task);
      importedTasks.push(imported);
    }
  }

  ctx.body = importedTasks.length + ' tasks imported';
  ctx.status = 200;
};

export const getOauthAuthorizationURL: RouteHandlerFnc = async (ctx, _) => {
  try {
    const jiraconfiguration = await JiraConfiguration.query().findById(
      ctx.params.id,
    );

    const oauthResponse = await authorizationURL(
      jiraconfiguration.url,
      jiraconfiguration.privatekey,
    );
    ctx.body = {
      url: oauthResponse.url,
      token: oauthResponse.token,
      tokenSecret: oauthResponse.token_secret,
    };
    ctx.status = 200;
  } catch (error) {
    ctx.body = {
      error: 'Error in getting Jira OAuth authorization URL: ' + error,
    };
    ctx.status = 500;
  }
};

export const swapOauthAuthorizationToken: RouteHandlerFnc = async (ctx, _) => {
  const { verifierToken, token, token_secret } = ctx.request.body;

  try {
    const jiraconfiguration = await JiraConfiguration.query().findById(
      ctx.params.id,
    );
    const oauthResponse = await swapOAuthToken(
      jiraconfiguration.url,
      jiraconfiguration.privatekey,
      token,
      token_secret,
      verifierToken,
    );

    if (!oauthResponse || !oauthResponse.token) {
      throw 'Empty response on authorization token swap.';
    }

    const newToken = {
      provider: 'jira',
      instance: jiraconfiguration.url,
      type: 'Bearer',
      user: parseInt(ctx.state.user.id, 10),
      value: oauthResponse.token,
    };

    // TODO: Extract providers and token types somewhere to avoid magic numbers.
    const existing = await Token.query()
      .where('tokens.user', newToken.user)
      .where('provider', newToken.provider)
      .where('instance', newToken.instance)
      .where('type', newToken.type)
      .first();
    if (existing) {
      await Token.query().patchAndFetchById(existing.id, newToken);
    } else {
      await Token.query().insert(newToken);
    }

    ctx.status = 200;
    ctx.body = 'OAuth token swapped successfully.';
  } catch (error) {
    console.log('Controller error on OAuth URL creation:', error);
    ctx.status = 500;
    ctx.body = 'Exception is OAuth token swap.';
  }
};
