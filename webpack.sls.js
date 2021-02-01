const slsw = require("serverless-webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  entry: slsw.lib.entries,
  output: {
    filename: "[name].js",
  },
});
