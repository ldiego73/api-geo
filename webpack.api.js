const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: "./src/interfaces/api/server.ts",
  output: {
    filename: "server.js",
  },
});
