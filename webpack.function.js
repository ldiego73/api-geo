const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: "./src/interfaces/function/handler.ts",
  output: {
    filename: "handler.js",
  },
});
