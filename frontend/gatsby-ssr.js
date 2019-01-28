import wrapWithProvider from "./wrap-with-provider";
export const wrapRootElement = wrapWithProvider;

// Remove autoprefixer.
// Makes debugging harder and we deploy only for modern browsers.
require("glamor").plugins.clear();
