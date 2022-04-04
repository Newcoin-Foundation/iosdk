"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const overmind_1 = require("overmind");
const exposeIndicators = ({ state }, { actionName }) => {
    const st = state.indicators;
    st.isWorking = st._isWorking > 0;
    const sp = st._specific[actionName];
    // if(actionName == "api.post.attachToMoods")
    console.log(`indicators.${actionName}`, sp);
    st.specific[actionName] = sp;
    // console.log(`indicators.specific ${actionName} ${st._specific[actionName]}`)
};
const isWorkingActionDebounced = (0, overmind_1.pipe)((0, overmind_1.debounce)(300), exposeIndicators);
const isWorkingAction = ({ actions, state }, { actionName, n }) => {
    const st = state.indicators;
    const __isWorking = st._isWorking + ((n > 0) ? 1 : -1);
    const _isWorking = Math.max(__isWorking, 0);
    const isWorking = _isWorking > 0;
    const ___specific = (st._specific[actionName] || 0) + ((n > 0) ? 1 : -1);
    const _specific = Math.max(___specific, 0);
    // const isWorkingSpecific = _specific > 0;
    st.isWorking = isWorking;
    st._isWorking = _isWorking;
    st._specific[actionName] = _specific;
    exposeIndicators({ state }, { actionName });
    // if(_isWorking > 0 || _specific > 0)
    //     exposeIndicators({ state }, { actionName })
    // else
    //     actions.indicators.isWorkingActionDebounced({ actionName })
    // set(st._specific, actionName, _specific);
    // set(st.specific, actionName, specific);
};
// const _isWorkingReaction: Action<number> =
//     when(
//         (_, w) => {
//             console.log("isrowking", w);
//             return w > 0
//         },
//         {
//             true: ({ stae }: Context) => {
//                 state.indicators.isWorking = true;
//                 console.log("isWorking", state.indicators.isWorking)
//             },
//             false: pipe(
//                 debounce(500),
//                 ({ state }: Context) => {
//                     state.indicators.isWorking = state.indicators._isWorking <= 0;
//                     console.log("isWorking", state.indicators.isWorking)
//                 }
//             )
//         });
// const onInitializeOvermind: Action = ({ reaction, actions }) => {
//     reaction(
//         (st) => st.indicators._isWorking,
//         actions.indicators._isWorkingReaction
//     )
// }
exports.default = {
    state: {
        _isWorking: 0,
        isWorking: true,
        _specific: {},
        specific: {}
    },
    actions: {
        // onInitializeOvermind,
        isWorking: isWorkingAction,
        isWorkingActionDebounced
    }
};
//# sourceMappingURL=index.js.map