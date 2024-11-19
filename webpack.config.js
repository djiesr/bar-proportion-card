const path = require('path');

module.exports = {
  entry: './src/bar-proportion-card.js',
  output: {
    filename: 'bar-proportion-card.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
