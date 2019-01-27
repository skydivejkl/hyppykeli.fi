const dropzones = [
    {
        icaocode: "EFJY",
        lat: 62.40739,
        lon: 25.66362,
        fmisid: 101339,
    },
    {
        icaocode: "EFUT",
        lat: 60.898498,
        lon: 26.924409,
        fmisid: 101191,
    },
    {
        icaocode: "EFKU",
        lat: 63.012165,
        lon: 27.790366,
        fmisid: 101570,
    },
    {
        icaocode: "EFPO",
        lat: 61.46169,
        lon: 21.79998,
        fmisid: 101064,
    },
    {
        icaocode: "EFOU",
        lat: 64.93054,
        lon: 25.358608,
        fmisid: 101799,
    },
    {
        icaocode: "EFKE",
        lat: 65.781324,
        lon: 24.58235,
        fmisid: 101840,
    },
    {
        icaocode: "EFTU",
        lat: 60.508105,
        lon: 22.264629,
        fmisid: 100949,
    },
    {
        icaocode: "EFJM",
        lat: 61.773331,
        lon: 22.717113,
        fmisid: 101291,
    },
    {
        icaocode: "EFLA",
        lat: 61.147442,
        lon: 25.693681,
        fmisid: 101185,
    },
    {
        icaocode: "EFVA",
        lat: 63.040419,
        lon: 21.773248,
        fmisid: 101485,
    },
    {
        icaocode: "EFAL",
        lat: 62.5551416,
        lon: 23.571403,
        fmisid: 101310,
    },
    {
        icaocode: "EFTP",
        lat: 61.423219,
        lon: 23.607258,
        fmisid: 101118,
    },
    {
        icaocode: "EFHF",
        lat: 60.251799,
        lon: 25.051025,
        fmisid: 101009,
    },
    {
        icaocode: "EFLP",
        lat: 61.042674,
        lon: 28.140217,
        fmisid: 101237,
    },
    {
        icaocode: "EFMA",
        lat: 60.12625,
        lon: 19.904472,
        fmisid: 100907,
    },
    {
        icaocode: "EFHK",
        lat: 60.319083,
        lon: 24.96871,
        fmisid: 100968,
    },
];

module.exports = {
    siteMetadata: {
        title: "Hyppykeli",
        dropzones,
    },
    plugins: [
        "gatsby-plugin-glamor",
        {
            resolve: "gatsby-source-graphql",
            options: {
                // This type will contain remote schema Query type
                typeName: "WP",
                // This is field under which it's accessible
                fieldName: "wp",
                // Url to query from
                url: "http://graphql.valudata-fi.test/graphql",
            },
        },
        {
            resolve: `gatsby-plugin-emotion`,
            options: {
                // Accepts all options defined by `babel-plugin-emotion` plugin.
            },
        },
        "gatsby-plugin-typescript",
        "gatsby-plugin-react-helmet",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "images",
                path: `${__dirname}/src/images`,
            },
        },
        "gatsby-transformer-sharp",
        "gatsby-plugin-sharp",
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                name: "gatsby-starter-default",
                short_name: "starter",
                start_url: "/",
                background_color: "#663399",
                theme_color: "#663399",
                display: "minimal-ui",
                icon: "src/images/gatsby-icon.png", // This path is relative to the root of the site.
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.app/offline
        // 'gatsby-plugin-offline',
    ],
};
