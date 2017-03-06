module.exports = {
    entry: "./lib/index.js",
    output: {
        path: __dirname + "/dist",
        // export to AMD, CommonJS, or window
        libraryTarget: 'umd',
        filename: "bpmn-embedded-comments.js"
    }
}
