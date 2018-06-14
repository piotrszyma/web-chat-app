'use strict';

const config = require('./config/config');
const NodeService = require('./src/services/common/node-service');

const { server } = config;
if (!server) throw new Error('configuration cannot be null/undefined');

const PORT = server.port;

if (NodeService.isProduction()) {
    const express = require('express');
    const path = require('path');

    const app = express();

    // Configure static resources
    app.use(
        express.static(
            path.join(__dirname, '/dist')
        )
    );

    // Configure server-side routing
    app.get('*', (req, res) => {
        const dist = path.join(
            __dirname, '/dist/index.html'
        );
        res.sendFile(dist);
    });

    // Open socket
    app.listen(PORT, () => {
        console.log(`Started Express server on port ${PORT}`);
    });
} else {
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const config = require('./webpack.config.js');

    const CLIENT_IP = '10.8.0.18.xip.io';

    new WebpackDevServer(webpack(config), {
        hot               : true,
        historyApiFallback: true,
        host : CLIENT_IP,
        open: true,
        stats: {
            colors: true
        }
    }).listen(PORT, CLIENT_IP, error => {
        console.log(error || `Started WebpackDevServer on port ${PORT}`);
    });
}
