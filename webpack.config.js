const path = require("path");

module.exports = {
    entry: {
        editor: path.resolve(__dirname, "src", "main", "ts", "mode", "editor.ts"),
        tokopuyo: path.resolve(__dirname, "src", "main", "ts", "mode", "tokopuyo.ts"),
        nazotoki: path.resolve(__dirname, "src", "main", "ts", "mode", "nazotoki.ts"),
        dodai: path.resolve(__dirname, "src", "main", "ts", "mode", "dodai.ts")
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