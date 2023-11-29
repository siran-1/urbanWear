const path = require('path');

module.exports = {
  mode: 'development',
  entry: './node_modules/urbanwear-dashboard/dashboardlibrary.js',
  output: {
    path: path.resolve(__dirname, 'public/javascripts'),
    filename: 'bundle.js',
    library: 'GenerateChart', 
    libraryTarget: 'window',
  },
};
