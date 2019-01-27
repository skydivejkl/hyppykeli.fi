export type Maybe<T> = T | null;

// ====================================================
// Documents
// ====================================================

export type FuckVariables = {};

export type FuckQuery = {
    __typename?: "Query";

    site: Maybe<FuckSite>;

    wp: Maybe<FuckWp>;
};

export type FuckSite = {
    __typename?: "Site";

    siteMetadata: Maybe<FuckSiteMetadata>;
};

export type FuckSiteMetadata = {
    __typename?: "siteMetadata_2";

    loljee: Maybe<string>;
};

export type FuckWp = {
    __typename?: "WP";

    pages: Maybe<FuckPages>;
};

export type FuckPages = {
    __typename?: "WP_RootQueryToPageConnection";

    edges: Maybe<FuckEdges[]>;
};

export type FuckEdges = {
    __typename?: "WP_RootQueryToPageConnectionEdge";

    node: Maybe<FuckNode>;
};

export type FuckNode = {
    __typename?: "WP_Page";

    title: Maybe<string>;
};
