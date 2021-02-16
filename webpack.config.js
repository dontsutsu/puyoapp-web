const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        editor: path.resolve(__dirname, "src", "main", "ts", "editor.ts"),
        tokopuyo: path.resolve(__dirname, "src", "main", "ts", "tokopuyo.ts"),
        nazotoki: path.resolve(__dirname, "src", "main", "ts", "nazotoki.ts")
    },
    output: {
        path: path.resolve(__dirname, "src", "main", "resources", "static", "js"),
        filename: "[name]_bundle.js"
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