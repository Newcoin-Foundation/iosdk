"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const antd_1 = require("antd");
const form_1 = __importDefault(require("antd/lib/form"));
const overmind_1 = require("../../../../overmind");
const state_1 = require("../../../../overmind/auth/state");
const UserCreate_1 = require("../../../User/UserCreate");
const Auth_1 = require("../../Auth");
require("./styles/Form.less");
const PhoneForm = ({ setIsErrorSubmit, embedded, phoneForm, isErrorSubmit, setError, error, }) => {
    const state = (0, overmind_1.useAppState)();
    const actions = (0, overmind_1.useActions)();
    return ((0, jsx_runtime_1.jsxs)(form_1.default, { form: phoneForm, hidden: state.auth.status !== state_1.AUTH_FLOW_STATUS.ANONYMOUS, ...Auth_1.layout, name: "basic", initialValues: { phone: "+420111111111" }, onFinish: ({ phone }) => {
            actions.firebase.requestToken({ phone });
            // phoneForm.resetFields();
        }, 
        // onFinishFailed={onFinishFailed}
        autoComplete: "off", className: "text-center", children: [(0, jsx_runtime_1.jsx)(form_1.default.Item, { name: "phone", rules: [
                    {
                        required: true,
                        message: "The phone number is invalid.",
                        pattern: new RegExp("^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,7}$"),
                    },
                ], className: "phone-form-height", children: (0, jsx_runtime_1.jsx)(antd_1.Input, { className: "text-center", placeholder: "enter phone number", suffix: (0, jsx_runtime_1.jsx)(UserCreate_1.CrossCircleErr, {}), onChange: () => {
                        phoneForm
                            .validateFields()
                            .then(() => {
                            setIsErrorSubmit
                                ? setIsErrorSubmit(false)
                                : setError(false);
                        })
                            .catch((e) => {
                            console.log(e.errorFields?.length);
                            if (e.errorFields?.length) {
                                setIsErrorSubmit
                                    ? setIsErrorSubmit(true)
                                    : setError(true);
                            }
                        });
                    } }) }), (0, jsx_runtime_1.jsx)("div", { className: "app-control-surface", hidden: embedded, children: (0, jsx_runtime_1.jsx)(antd_1.Button, { type: "primary", htmlType: "submit", className: isErrorSubmit || error ? "disabled-submit-button" : "", children: "Send verification" }) })] }));
};
exports.default = PhoneForm;
//# sourceMappingURL=PhoneForm.js.map