import { resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin, { loader as _loader } from "mini-css-extract-plugin";
import { FORMERR } from "dns";

export const entry = {
  main: "./src/index.js",
};
export const output = {
  path: resolve(__dirname, "dist"),
  filename: "main.js",
  publicPath: "",
};
export const mode = "development";
export const devtool = "inline-source-map";
export const stats = "errors-only";
export const devServer = {
  static: resolve(__dirname, "./dist"),
  compress: true,
  port: 8080,
  open: true,
  liveReload: true,
  hot: false,
};
export const target = ["web", "es5"];
export const module = {
  rules: [
    {
      test: /\.js$/,
      loader: "babel-loader",
      exclude: "/node_modules/",
    },
    {
      test: /\.css$/,
      use: [
        _loader,
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
          },
        },
        "postcss-loader",
      ],
    },
    {
      test: /\.(png|svg|jpg|jpeg|webp|gif|woff(2)?|eot|ttf|otf)$/,
      type: "asset/resource",
    },
  ],
};
export const plugins = [
  new HtmlWebpackPlugin({
    template: "./src/index.html",
  }),
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
];

export const LOADER = _loader;
