import { Callback, NLView } from "../types";
import { MoodReadResponse } from "@newcoin-foundation/iosdk-newgraph-client-js";
export declare const MoodFolderWidget: NLView<{
    mood: MoodReadResponse;
    onClick?: Callback;
    selected?: boolean;
    force?: boolean;
}>;
export declare const MoodWidget: NLView<{
    mood: MoodReadResponse;
    onClick?: Callback;
    selected?: boolean;
    force?: boolean;
}>;
