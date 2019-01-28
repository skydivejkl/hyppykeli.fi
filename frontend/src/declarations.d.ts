export interface GatsbyPage<Data = any, Context = any> {
    path: string;
    "*": string;
    uri: string;
    location: GatsbyLocation;
    pageResources: PageResources;
    data: Data;
    pageContext: Context;
    pathContext: Context;
}

// export interface Data {
//     site: Site;
// }

// export interface Site {
//     siteMetadata: SiteMetadata;
// }

// export interface SiteMetadata {
//     dropzones: Dropzone[];
// }

// export interface Dropzone {
//     icaocode: string;
//     lat:      number;
//     lon:      number;
//     fmisid:   number;
// }

export interface GatsbyLocation {
    href: string;
    ancestorOrigins: AncestorOrigins;
    origin: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
    state: null;
    key: string;
}

export interface AncestorOrigins {}

// export interface Context {
//     icaocode: string;
// }

export interface PageResources {
    page: Page;
}

export interface Page {
    componentChunkName: string;
    jsonName: string;
    path: string;
}
