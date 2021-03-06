import { Action, Link } from "../../types";
import { History } from "history";
export declare const routeAfterAuth: Action<undefined>;
export declare const goBack: Action;
export declare const onRouteChange: Action<{
    location: {
        pathname: string;
        search: string;
    };
}>;
export declare const setPreloginRoute: Action<undefined>;
export declare const setHistory: Action<{
    history: History;
}>;
export declare const historyPush: Action<{
    location: string;
    force?: boolean;
}>;
export declare const setBreadcrumbs: Action<Link[]>;
export declare const setTitle: Action<string | undefined>;
