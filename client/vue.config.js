const path = require('path');

process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
    devServer: {
        disableHostCheck: true,
        contentBase: path.join(__dirname, 'public')
    },

    lintOnSave: false
}
