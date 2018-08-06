const express = require('express')
const { parse } = require('url')
const next = require('next')
const pathMatch = require('path-match')
const route = pathMatch()
const axios = require('axios')
const communityservice = require('./service/communityservice');
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev: process.env.NODE_ENV === 'development' });
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = express()
    server.set('port', port)

    server.get('/community/:id/details', (req, res) => {
        const match = route('/community/:id/details')
        const { pathname, query } = parse(req.url, true)
        const parameters = match(pathname)
        req.params.id = parameters.id;
    
        if (parameters === false) {
            handle(req, res)
            return
        }
     
        communityservice.getCommunity(req, res, function (communitydetails, communitypermissions) {
            res.communitydetails = communitydetails.data;
            res.communitypermissions = communitypermissions.data;
            res.slugId = req.params.id;
            app.render(req, res, '/main');
        })
    });

    server.get('*', (req, res) => {

        app.render(req, res, '/');
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`Express server listening on port ${server.get('port')}`)
    })
});