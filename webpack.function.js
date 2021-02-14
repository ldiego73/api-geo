const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: "./src/interfaces/function/index.ts",
  output: {
    filename: "index.js",
  },
});
