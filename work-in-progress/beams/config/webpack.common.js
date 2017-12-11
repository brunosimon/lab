const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
	devServer:
	{
		contentBase: path.resolve(__dirname, '../build'),
		hot: true
	},
    plugins:
    [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
		}),
        new CopyWebpackPlugin([{ from: path.resolve(__dirname, '../static'), to: 'static' }])
    ],
    output:
    {
        filename: 'js/bundle.[hash].js',
        path: path.resolve(__dirname, '../build')
    },
    module:
    {
        rules:
        [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use:
                {
                    loader: 'babel-loader',
                    options:
                    {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use:
                {
                    loader: 'file-loader',
                    options:
                    {
                        name: 'images/[name].[hash].[ext]'
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use:
                {
                    loader: 'file-loader',
                    options:
                    {
                        name: 'fonts/[name].[hash].[ext]'
                    }
                }
            },
            {
                test: /\.glsl$/,
                use: 'raw-loader'
            }
        ]
    }
}
