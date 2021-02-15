const path = require("path");

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "src", "main", "ts", "main.ts"),
    output: {
        path: path.resolve(__dirname, "src", "main", "resources", "static", "js"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    devServer: {
        contentBase: path.resolve(__dirname, "src", "main", "resources", "static")
    }
}