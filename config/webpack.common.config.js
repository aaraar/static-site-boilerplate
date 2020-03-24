const { CleanWebpackPlugin } = require ( 'clean-webpack-plugin' );
const path = require ( 'path' );
const CopyWebpackPlugin = require ( 'copy-webpack-plugin' );
const MiniCssExtractPlugin = require ( 'mini-css-extract-plugin' );
const ServiceWorkerWebpackPlugin = require ( 'serviceworker-webpack-plugin' );
const WebpackManifestPlugin = require ( 'webpack-manifest-plugin' );

module.exports = {

    entry: [
        './src/index.js',
        './node_modules/regenerator-runtime/runtime.js'
    ],
    output: {
        filename: '[name]-[contenthash].js',
        path: path.resolve ( __dirname, '..', 'public' ),
    },
    resolve: {
        extensions: [ '.js' ],
    },
    module: {
        rules: [
            {
                test: [ /.js$/ ],
                exclude: /(node_modules)(data)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env' ]
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'static/assets/images'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin (),
        new MiniCssExtractPlugin ( {
            to: 'styles',
            filename: 'styles-[contenthash].css'
        } ),
        new WebpackManifestPlugin (),
        new ServiceWorkerWebpackPlugin ( {
            entry: path.join ( __dirname, '..', 'src/modules/service-worker.js' ),
            filename: 'service-worker.js',
            includes: [ '*.css', '*.js' ],
        } ),
        new CopyWebpackPlugin ( [
            {
                from: path.join ( __dirname, '..', 'src/assets/images' ),
                to: path.join ( __dirname, '..', 'public/assets/images' )
            },
            {
                from: path.join ( __dirname, '..', 'src/favicon' ),
                to: path.join ( __dirname, '..', 'public/favicon' )
            },
            {
                from: path.join ( __dirname, '..', 'src/manifest.webmanifest' ),
                to: path.join ( __dirname, '..', 'public/manifest.webmanifest' )
            },
            // {
            //     from: path.join ( __dirname, '..', 'src/api' ),
            //     to: path.join ( __dirname, '..', 'api' )
            // }
        ], )
    ]
};