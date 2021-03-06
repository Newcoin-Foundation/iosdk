import { HyperionAccountHistory } from "../overmind/newcoin/types";
import { MoodReadResponse } from "@newcoin-foundation/iosdk-newgraph-client-js";
import { PowerupsCacheItem } from "../overmind/api/state";
import { json } from "overmind";
import { omit } from "lodash";
import { useActions, useAppState } from "../overmind";
import { useEffect } from "react";

export const useCachedUser = (user?: { id?: string; username?: string }, force?: boolean) => {
  const state = useAppState();
  const actions = useActions();

  const byIdOrUsername = (u?: { id?: string; username?: string }) => {
    const cachedItem = u?.id
      ? state.api.cache.users.byId[u?.id]
      : u?.username
      ? state.api.cache.users.byUsername[u?.username]
      : {};
    return cachedItem && cachedItem.id && cachedItem.username ? cachedItem : null;
  };

  useEffect(() => {
    if ((user?.id || user?.username) && state.auth.authenticated && (force || !byIdOrUsername(user))) {
      actions.api.user.read(user);
      // if (force && !byIdOrUsername(user)?.moods?.length)
      //     actions.api.user.getMoods(user);
    }
  }, [state.auth.authenticated, user?.id || "", user?.username || ""]);
  const u = byIdOrUsername(user);
  return { ...(u || {}), moods: u?.moods };
};

export const useCachedPost = ({ id }: { id?: string }, force?: boolean) => {
  const state = useAppState();
  const actions = useActions();
  useEffect(() => {
    id && state.auth.authenticated && (force || !state.api.cache.posts[id]) && actions.api.post.read({ id });
  }, [state.auth.authenticated, id]);
  return (id && state.api.cache.posts[id]) || {};
};

export const useCachedMood = ({ id }: { id?: string }, force?: boolean) => {
  const state = useAppState();
  const actions = useActions();
  useEffect(() => {
    id &&
      state.auth.authenticated &&
      (force || !state.api.cache.moods[id]) && //|| !state.api.cache.moods[id].posts?.length) &&
      actions.api.mood.read({ id });
  }, [state.auth.authenticated, id]);
  return (id && state.api.cache.moods[id]) || {};
};

export const useCachedMoodPosts = ({ id }: { id?: string }, force?: boolean) => {
  const state = useAppState();
  const actions = useActions();

  useEffect(() => {
    id &&
      state.auth.authenticated &&
      (force || !state.api.cache.moods[id]) && //|| !state.api.cache.moods[id].posts?.length) &&
      actions.api.mood.getPosts({ id });
  }, [state.auth.authenticated, id]);
  return (id && state.api.cache.moods[id]) || {};
};

export const useCachedMoods = (moods?: { id?: string }[], force?: boolean) => {
  const state = useAppState();
  const actions = useActions();
  const moodsCollector: MoodReadResponse[] = [];
  useEffect(() => {
    const res: MoodReadResponse[] = [];

    moods &&
      moods.length &&
      state.auth.authenticated &&
      Promise.all(
        moods
          .map(
            ({ id }) =>
              id &&
              (force || !state.api.cache.moods[id] || !state.api.cache.moods[id].posts?.length) &&
              actions.api.mood.read({ id }),
          )
          .filter(Boolean),
      ).then((r) => r.reduce((m) => m));
  }, [state.auth.authenticated, moods]);

  return moodsCollector;
};

export const useCachedPowerups = (user?: { id?: string }, force?: boolean) => {
  const state = useAppState();
  const actions = useActions();

  const current = state.api.auth.user || {};
  const id = user?.id || current.id || "";
  const targetPu = state.api.cache.powerups && state.api.cache.powerups[id];
  const currentPu = state.api.cache.powerups[current.id || ""];
  useEffect(() => {
    id && state.auth.authenticated && (force || !state.api.cache.powerups[id]) && actions.api.user.getPowerups({ user: { id } });
  }, [current.id, id, targetPu, currentPu]);
  return id && ((state.api.cache.powerups[id] ? json(state.api.cache.powerups[id]) : {}) as PowerupsCacheItem);
};

export const useCachedNewconAccountHistory = (user: { username?: string }, force?: boolean) => {
  const state = useAppState();
  const actions = useActions();
  useEffect(() => {
    user.username &&
      state.auth.authenticated &&
      (force || !state.newcoin.cache.accountHistory[user.username || ""]) &&
      actions.newcoin.getAccountHitory({ user });
  }, [user.username]);
  return (user.username && state.newcoin.cache.accountHistory[user.username]) || ({} as HyperionAccountHistory);
};

export const useCachedPool = (pool?: { owner?: string; code?: string }, force?: boolean) => {
  const state = useAppState();
  const actions = useActions();

  const pools = state.newcoin.cache.pools; //.byOwner[pool?.code];

  const id = pool?.owner || pool?.code || "";
  const cache = pool?.owner ? pools.byOwner : pools.byCode;

  useEffect(() => {
    // if(!state.auth.authenticated) return;
    if (!pool || !id) return;

    if (force || !cache[id]) {
      actions.newcoin.getPoolInfo({ pool });
      console.log("Getting pool for ", id);
    } else console.log("NOT Getting pool for ", id);
  }, [id, cache[id]]);

  return cache[id] ? cache[id].rows[0] : { owner: "", code: "", total: { quantity: 0 } }; //cache[id] || { rows: [], more: false, next_key: "" };
};

export const useCachedPoolByCode = (pool: { code?: string }, force?: boolean) => {
  const state = useAppState();
  const actions = useActions();
  useEffect(() => {
    pool.code &&
      state.auth.authenticated &&
      (force || !state.newcoin.cache.pools.byCode[pool.code || ""]) &&
      actions.newcoin.getPoolInfo({ pool });
  }, [pool.code]);
  return pool.code && state.newcoin.cache.pools.byCode[pool.code];
};

export const useCachedDaoProposals = (params?: { daoOwner?: string }) => {
  const { daoOwner } = params || {};
  const state = useAppState();
  const actions = useActions();

  const _daoOwner = daoOwner || state.config.settings.newcoin.daoDomain;

  useEffect(() => {
    actions.newcoin.daoGetProposals({ daoOwner: _daoOwner });
  }, [daoOwner]);

  return {
    ...(state.newcoin.daos[_daoOwner]?.proposals || {}),
    daoOwner: _daoOwner,
  };
};

export const useCachedDaoWhitelistProposals = (params?: { daoOwner?: string }) => {
  const { daoOwner } = params || {};
  const state = useAppState();
  const actions = useActions();

  const _daoOwner = daoOwner || state.config.settings.newcoin.daoDomain;

  useEffect(() => {
    actions.newcoin.daoGetWhitelistProposals({ daoOwner: _daoOwner });
  }, [daoOwner]);

  return {
    // list: state.newcoin.daos[_daoOwner]?.whitelistProposals,
    // list: [],
    ...(state.newcoin.daos[_daoOwner]?.whitelistProposals || {}),
    daoOwner: _daoOwner,
  };
};

export const useCachedDaoWhitelist = (params?: { daoOwner?: string }) => {
  const { daoOwner } = params || {};
  const state = useAppState();
  const actions = useActions();

  const _daoOwner = daoOwner || state.config.settings.newcoin.daoDomain;

  useEffect(() => {
    actions.newcoin.daoGetWhitelist({ daoOwner: _daoOwner });
  }, [daoOwner]);

  return {
    ...(state.newcoin.daos[_daoOwner]?.whitelist || {}),
    daoOwner: _daoOwner,
  };
};

export const useCachedDaoProposal = ({ daoOwner, proposalId }: { daoOwner?: string; proposalId?: string }) => {
  const daoInfo = useCachedDaoProposals({ daoOwner });

  return {
    // ...((daoInfo.rows || [])[proposalId || 0] || {}),
    ...daoInfo.rows?.filter((row) => row.id == proposalId)[0],
    ...omit(daoInfo, "rows"),
  };
};

export const useCachedDaoWhitelistProposal = ({ daoOwner, proposalId }: { daoOwner?: string; proposalId?: string }) => {
  const daoInfo = useCachedDaoWhitelistProposals({ daoOwner });

  return {
    // ...((daoInfo.list || [])[proposalId || 0] || {}),
    ...daoInfo.rows?.filter((row) => row.id == proposalId)[0],
    ...omit(daoInfo, "rows"),
  };
};
