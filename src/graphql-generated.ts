export type Maybe<T> = T | null;

// ====================================================
// Documents
// ====================================================

export type FuckVariables = {};

export type FuckQuery = {
    __typename?: "Query";

    site: Maybe<FuckSite>;

    ding: Maybe<FuckDing>;
};

export type FuckSite = {
    __typename?: "Site";

    siteMetadata: Maybe<FuckSiteMetadata>;
};

export type FuckSiteMetadata = {
    __typename?: "siteMetadata_2";

    loljee: Maybe<string>;
};

export type FuckDing = {
    __typename?: "DING";

    pages: Maybe<FuckPages>;
};

export type FuckPages = {
    __typename?: "DING_RootQueryToPageConnection";

    edges: Maybe<FuckEdges[]>;
};

export type FuckEdges = {
    __typename?: "DING_RootQueryToPageConnectionEdge";

    node: Maybe<FuckNode>;
};

export type FuckNode = {
    __typename?: "DING_Page";

    title: Maybe<string>;
};
