module.exports = {
    siteMetadata: {
        title: "Hyppykeli",
    },
    proxy: {
        prefix: "/api",
        url: "http://localhost:" + (process.env.API_PORT || 32944),
    },
    plugins: [
        "gatsby-plugin-lodash",
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
                name: "Hyppykeli.fi",
                short_name: "Hyppykeli.fi",
                start_url: "/",
                background_color: "skyblue",
                theme_color: "skyblue",
                display: "minimal-ui",
                icon: "src/images/parachute-icon.png", // This path is relative to the root of the site.
            },
        },
        "gatsby-plugin-offline",
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.app/offline
        // 'gatsby-plugin-offline',
    ].filter(Boolean),
};
