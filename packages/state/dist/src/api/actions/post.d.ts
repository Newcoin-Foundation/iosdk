import { MoodReadResponse, PostCreateRequest, PostReadResponse } from "@newlife/newlife-creator-client-api";
import { Action } from "@newcoin-foundation/core";
export declare const read: Action<{
    id: string;
}>;
export declare const create: Action<{
    postForm: PostCreateRequest & {
        file: any;
    };
}, PostReadResponse | void>;
export declare const attachToMoods: Action<{
    moods: MoodReadResponse[];
    post: PostReadResponse;
}>;
export declare const rate: Action<{
    post: PostReadResponse;
    amount: number;
}>;
//# sourceMappingURL=post.d.ts.map