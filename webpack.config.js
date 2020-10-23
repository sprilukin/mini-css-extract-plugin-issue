const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    resolve: {
        modules: [path.resolve(process.cwd(), 'node_modules')]
    },

    module: {
        rules: [
            // file loader allows to copy file to the build folder and form proper url
            // usually images are used from css files, see css loader below
            {
                test: /\.png$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "_assets/[name].[ext]"
                        }
                    }
                ]
            },
            // css files are processed to copy any dependent resources like images
            // then they copied to the build folder and inserted via link tag
            {
                test: /\.css$/i,
                sideEffects: true,
                exclude: /node_modules/,
                // for tests we use simplified raw-loader for css files
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // public path has changed so url(...) inside css files use relative pathes
                            // like: url(../_assets/image.png) instead of absolute urls
                            publicPath: '../',
                        }
                    },
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        // plugin helps to properly process css files which are imported from the source code
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '_assets/[name].css',
            chunkFilename: '_assets/[id].css'
        })
    ],
    entry: {
        'test': "./src/test"
    },
    output: {
        path: path.resolve(process.cwd(), `public`),
        publicPath: '',
        filename: '[name].js',
        chunkFilename: '_chunks/chunk.[name].js'
    }
};