module.exports = {
    siteMetadata: {
        title: "Hyppykeli",
    },
    plugins: [
        "gatsby-plugin-lodash",
        "gatsby-plugin-glamor",
        process.env.ANALYZE
            ? {
                  resolve: "gatsby-plugin-webpack-bundle-analyzer",
                  options: {
                      analyzerPort: 3000,
                      production: true,
                  },
              }
            : null,
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
    ].filter(Boolean),
};
