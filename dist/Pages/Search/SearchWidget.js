import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, Col, Row, Select } from "antd";
import { ContentImage } from "../../Components/Image";
import { Searchicon } from "../../Components/Icons/Searchicon";
import { UsersList } from "../../Components/UserWidget";
import { VerifiedIcon } from "../../Components/Icons/VerifiedIcon";
import { json } from "overmind";
import { map, uniqBy } from "lodash";
import { useActions, useAppState } from "../../overmind";
import { useEffect, useState } from "react";
import { useVerified } from "../../hooks/useVerified";
export const UserSearchResultsWidget = ({ query }) => {
    const state = useAppState();
    const actions = useActions();
    const res = state.lists.search.users.results;
    useEffect(() => {
        actions.lists.searchUsers({ query });
    }, [query]);
    return (_jsx(Select.Option, { className: "nl-white-box app-box-shadow paragraph-1r user-search-results-widget", children: res && res?.value?.length ? (_jsx(UsersList, { users: res.value, powerUp: false })) : res && !res?.value?.length ? ("No results") : ("") }));
};
export const TagsAutosuggestWidget = ({ query }) => {
    const state = useAppState();
    const actions = useActions();
    const res = uniqBy(json(state.lists.search.tags.results)?.value || [], (t) => t.tag);
    useEffect(() => {
        actions.lists.searchTags({ query });
    }, [query]);
    return (_jsx("div", { style: {
            padding: 24,
            maxWidth: 700,
            marginTop: 5,
            marginLeft: 150,
        }, className: "nl-white-box app-box-shadow paragraph-1r user-search-results-widget", children: res.length
            ? res.map((t) => (_jsx("div", { style: { width: "100%", cursor: "pointer" }, onClick: () => actions.routing.historyPush({
                    location: `/search?tags=${t.tag}`,
                }), children: t.tag }, t.tag)))
            : res && !res?.length
                ? "No results"
                : "" }));
};
const SearchResultsByMode = {
    "@": UserSearchResultsWidget,
    "#": TagsAutosuggestWidget,
};
export const SearchWidget = ({ user, searchUsers, searchTags, noNavigation, onChange, showSearch }) => {
    const state = useAppState();
    const actions = useActions();
    const [query, setQuery] = useState("");
    const [selection, setSelection] = useState("");
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(true);
    const [mouseVisible, setMouseVisible] = useState(false);
    const [justNavigated, setJustNavigated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filterState, setFilterState] = useState(undefined);
    const foundUsers = state.lists.search.users?.results?.value || [];
    const foundTags = Array.from(new Set((state.lists.search.tags?.results?.value || []).map((t) => t.tag))) || [];
    const { verifiedUsers } = useVerified(map(foundUsers, "username"));
    useEffect(() => {
        const searchForResults = async () => {
            if (query.length < 3)
                return;
            setLoading(true);
            const queryUsers = searchUsers && actions.lists.searchUsers({ query });
            const queryTags = searchTags && actions.lists.searchTags({ query });
            await Promise.all([queryUsers, queryTags]);
            setLoading(false);
        };
        searchForResults();
    }, [query]);
    return (_jsxs(Row, { align: "bottom", children: [_jsx("div", { style: { width: 30, margin: "16px 5px 0 5px" }, onClick: () => setVisible(!visible), onMouseOver: () => setMouseVisible(true), onMouseOut: () => setMouseVisible(false), children: _jsx(Searchicon, {}) }), _jsx("div", { children: !(showSearch || visible) && !mouseVisible ? (_jsx(_Fragment, {})) : (_jsxs(Select, { className: "search-widget", showSearch: true, allowClear: true, open: open && query.length >= 3, clearIcon: !loading ? (_jsx("div", { style: {
                            position: "absolute",
                            right: -10,
                            color: "white",
                        }, className: "paragraph-2b", onClick: () => setOpen(false), children: "Cancel" })) : (_jsx(_Fragment, {})), value: selection || [], loading: loading, defaultActiveFirstOption: true, filterOption: false, autoFocus: true, style: { marginTop: 12, width: "min(350px,80vw)" }, placeholder: "Search...", onSearch: (v) => {
                        setQuery(v);
                        setOpen(true);
                        setJustNavigated(false);
                    }, onBlur: () => setSelection(""), onSelect: (val) => {
                        if (justNavigated)
                            return;
                        const mode = /^[@#]/.test(val[0]) ? val[0] : "#";
                        const v = val.replace(/^[@#]/, "");
                        const path = mode === "#" ? `/search?tags=${v}` : `/user/${v}`;
                        setQuery("");
                        if (!noNavigation)
                            actions.routing.historyPush({
                                location: path,
                            });
                        setSelection(v);
                        onChange && onChange(v);
                        setJustNavigated(true);
                        // if(mode === "@")
                    }, dropdownRender: (menu) => (_jsxs("div", { children: [_jsx(Row, { style: {
                                    backgroundColor: "#A5A1A1",
                                    padding: 10,
                                }, children: foundUsers.length > 0 && foundTags.length > 0 ? (_jsxs(_Fragment, { children: [_jsx(Col, { className: filterState === "Member" ? "filter-tag filter-tag__active" : "filter-tag", onClick: () => {
                                                setFilterState("Member");
                                                setVisible(true);
                                            }, children: _jsx("p", { className: "paragraph-2b", children: "Member" }) }), _jsx(Col, { className: filterState === "Tag" ? "filter-tag filter-tag__active" : "filter-tag", onClick: () => {
                                                setFilterState("Tag");
                                                setVisible(true);
                                            }, children: _jsx("p", { className: "paragraph-2b", children: "Hashtag" }) })] })) : (_jsx(Col, { className: "filter-tag", children: _jsx("p", { className: "paragraph-2b", children: "No filters available." }) })) }), menu] })), children: [foundUsers?.map((u) => {
                            const isUserVerified = verifiedUsers && u.username && verifiedUsers.includes(u.username);
                            if (filterState === "Tag")
                                return;
                            return (_jsx(Select.Option, { value: `@${u.username}`, children: _jsxs(Row, { gutter: 18, className: "app-main-full-width-only", wrap: true, style: { alignItems: "center" }, children: [_jsx(Col, { children: _jsx(Avatar, { src: _jsx(ContentImage, { ...u }) }) }), _jsxs(Col, { children: [_jsx("p", { className: "paragraph-2b", children: u.username }), isUserVerified && _jsx(VerifiedIcon, {})] })] }) }));
                        }), foundTags.map((t) => {
                            if (filterState === "Member")
                                return;
                            return (_jsx(Select.Option, { value: `#${t}`, children: _jsxs(Row, { align: "middle", gutter: 18, className: "app-main-full-width-only", justify: "start", wrap: true, children: [_jsx(Col, { span: 5, children: _jsx(Avatar, { src: _jsx("div", { style: {
                                                        background: "lightgrey",
                                                        color: "grey",
                                                        paddingTop: 10,
                                                        paddingBottom: 10,
                                                    }, children: "#" }) }) }), _jsx(Col, { span: 13, children: _jsx("p", { className: "paragraph-2b", children: t }) }), _jsx(Col, { span: 6 })] }) }));
                        })] })) })] }));
};
//# sourceMappingURL=SearchWidget.js.map