export type Maybe<T> = T | null;

// ====================================================
// Documents
// ====================================================

export type DropzonesListVariables = {};

export type DropzonesListQuery = {
    __typename?: "Query";

    site: Maybe<DropzonesListSite>;
};

export type DropzonesListSite = {
    __typename?: "Site";

    siteMetadata: Maybe<DropzonesListSiteMetadata>;
};

export type DropzonesListSiteMetadata = {
    __typename?: "siteMetadata_2";

    dropzones: Maybe<DropzonesListDropzones[]>;
};

export type DropzonesListDropzones = {
    __typename?: "dropzones_2";

    icaocode: Maybe<string>;

    lat: Maybe<number>;

    lon: Maybe<number>;

    fmisid: Maybe<number>;
};

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

export type DropzonesVariables = {};

export type DropzonesQuery = {
    __typename?: "Query";

    site: Maybe<DropzonesSite>;
};

export type DropzonesSite = {
    __typename?: "Site";

    siteMetadata: Maybe<DropzonesSiteMetadata>;
};

export type DropzonesSiteMetadata = {
    __typename?: "siteMetadata_2";

    dropzones: Maybe<DropzonesDropzones[]>;
};

export type DropzonesDropzones = {
    __typename?: "dropzones_2";

    icaocode: Maybe<string>;

    lat: Maybe<number>;

    lon: Maybe<number>;

    fmisid: Maybe<number>;
};
