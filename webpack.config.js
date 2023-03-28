const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        app: './script.js',
        sw: './sw.js',
        lernziel: './src/lernziel.js' // include lernziel.js in the build
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
