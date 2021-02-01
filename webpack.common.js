const path = require("path");
const nodeExternals = require("webpack-node-externals");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const { NODE_ENV } = process.env || "development";

module.exports = {
  target: "node",
  mode: NODE_ENV,
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    plugins: [new TsconfigPathsPlugin({})],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
  },
};
