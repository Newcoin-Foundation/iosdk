import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Avatar, Col, Row } from "antd";
import { Button } from "antd/lib/radio";
import { ContentImage } from "./Image";
import { Link } from "react-router-dom";
import { LoadMore } from "./LoadMore";
import { UserPowerup } from "./UserWidget";
import { VerifiedIcon } from "./Icons/VerifiedIcon";
import { useActions, useAppState } from "../overmind";
import { useCachedPool, useCachedUser } from "../hooks/useCached";
import { useState } from "react";
import { useVerified } from "../hooks/useVerified";
import Title from "../Pages/Explore/Title";
// export const Creator: NLView
export const CreatorWidget = ({ creator, avatarClassName, buttonType, setAddedUsers, addedUsers }) => {
    const [activeButton, setActiveButton] = useState(false);
    const user = useCachedUser(creator);
    const { verifiedUsers } = useVerified([user.username || ""]);
    const isUserVerified = verifiedUsers && user.username && verifiedUsers.includes(user.username);
    avatarClassName = avatarClassName || "avatar-image-top-creators";
    const buttonClassName = activeButton ? "primary-green-btn" : "secondary-button";
    const buttonName = activeButton ? "Added!" : "Add";
    const poolInfo = useCachedPool({ owner: user?.username });
    const symbol = poolInfo.code;
    return (_jsx(Link, { to: `/user/${user.username}`, children: _jsxs(Row, { className: "bg-hover app-full-width", style: { alignItems: "center", justifyContent: "space-between" }, children: [_jsxs(Col, { className: "top-creators-first-col u-margin-left-medium", xs: 14, children: [_jsx(Col, { children: _jsx(Avatar, { src: _jsx(ContentImage, { ...user }), className: avatarClassName }) }), _jsx(Row, { align: "bottom", children: _jsxs(Col, { className: "top-creators-username", children: [_jsxs("p", { className: "top-creators-username__paragraph", children: [user.username, isUserVerified ? (_jsx("span", { className: "u-margin-left-medium", children: _jsx(VerifiedIcon, {}) })) : (false)] }), symbol && (_jsxs("p", { className: "paragraph-1r", children: ["powering ", creator.powering, " ", symbol] }))] }) })] }), _jsxs(Col, { className: "top-creators-second-col", children: [_jsx(Col, { className: "top-creators-number", children: _jsx("p", { className: "header-1r top-creators-powered", style: {
                                    margin: "0",
                                    justifyContent: "end",
                                    display: "flex",
                                    minWidth: "64px",
                                }, children: creator.powered }) }), _jsx(Col, { xs: 12, style: { display: "flex", justifyContent: "flex-end", zIndex: 9999 }, children: buttonType === "addUser" ? (_jsx(Button, { onClick: () => {
                                    if (addedUsers.includes(user.username)) {
                                        const arr = [...addedUsers];
                                        const index = arr.indexOf(user.username);
                                        index !== -1 && arr.splice(index, 1);
                                        setAddedUsers(arr);
                                    }
                                    else {
                                        setAddedUsers((p) => [...p, user.username]);
                                    }
                                    setActiveButton(!activeButton);
                                }, className: `${buttonClassName} u-margin-bottom-medium`, children: _jsx("span", { className: "paragraph-2b", children: buttonName }) })) : (_jsx("div", { onClick: (e) => e.preventDefault(), children: _jsx(UserPowerup, { user: creator }) })) })] })] }) }));
};
export const CreatorsList = ({ title, maxItems, users, buttonType, addedUsers, setAddedUsers }) => {
    const state = useAppState();
    maxItems = maxItems || 100;
    users = maxItems ? users?.slice(0, Math.min(users?.length, maxItems)) : users;
    // const creators =
    // 	!users ? state.lists.top.users.items : maxUsers;
    return (_jsxs(_Fragment, { children: [title === undefined && (_jsx(Row, { style: { width: "100%" }, children: _jsx("p", { className: "header-2 u-margin-bottom-medium", children: "Explore top creators" }) })), _jsxs("div", { style: { width: "100%" }, children: [maxItems && maxItems !== 100 ? _jsx(Title, { title: title, href: "/top/creators" }) : _jsx(_Fragment, {}), _jsx("div", { className: "top-creators-wrapper", children: users?.map((creator) => (_jsx(CreatorWidget, { creator: creator, buttonType: buttonType, setAddedUsers: setAddedUsers, addedUsers: addedUsers }))) })] })] }));
};
export const Creators = (props) => {
    return _jsx(CreatorsList, { ...props });
};
export const TopCreators = ({ maxItems, title, buttonType, addedUsers, setAddedUsers }) => {
    const state = useAppState();
    const actions = useActions();
    const creators = maxItems ? state.lists.top.users.items.slice(0, maxItems) : state.lists.top.users.items;
    return (_jsxs(_Fragment, { children: [_jsx(CreatorsList, { users: creators, maxItems: maxItems, title: title, buttonType: buttonType, addedUsers: addedUsers, setAddedUsers: setAddedUsers }), creators && (creators?.length || 0) < (maxItems || 100) && _jsx(LoadMore, { loadMore: () => actions.lists.top.users() })] }));
};
export default Creators;
//# sourceMappingURL=Creators.js.map