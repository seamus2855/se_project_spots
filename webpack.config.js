const fileURLToPath = require ("url" );
const dirname = require ("path");
const resolve = require ("path")
const HtmlWebpackPlugin = require ("html-webpack-plugin");
const CleanWebpackPlugin = require ("clean-webpack-plugin");
const MiniCssExtractPlugin = require ("mini-css-extract-plugin");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "main.js",
    publicPath: "",
  },
  mode: "development",
  devtool: "inline-source-map",
  stats: "errors-only",
  devServer: {
    static: resolve(__dirname, "./dist"),
    compress: true,
    port: 8080,
    open: true,
    liveReload: true,
    hot: false,
  },
  target: ["web", "es5"],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
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
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
};

