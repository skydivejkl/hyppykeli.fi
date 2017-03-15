const mock = require("mock-require");
// Mock modules that cannot be handled by node.js
mock("chart.js", null);
mock("react-spinner/react-spinner.css", null);
require("./index");
