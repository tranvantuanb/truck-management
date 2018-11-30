const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = {
  src: __dirname + "/src",
  dest: __dirname + "/src/public",
};

module.exports = {
  entry: paths.src + "/app/index.jsx",
  output: {
    path: paths.dest,
    publicPath: "/",
    filename: "react-app.js",
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.(pdf|jpg|png|gif|svg|ico)$/,
        use: [
          {
            loader: 'url-loader'
          }
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      axios: "axios"
    }),
    new HtmlWebpackPlugin({
      template: paths.src + "/index.html"
    })
  ],
};
