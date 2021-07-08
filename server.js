
const path = require('path');
const fs = require('fs');
const mainifest = require('./dist/server/ssr-manifest.json')
const express = require('express');
const { renderToString } = require('@vue/server-renderer');
const server  = express();

const appPath = path.join(__dirname,'./dist','server',mainifest['app.js']);
const createApp = require(appPath).default

server.use('/img',express.static(path.join(__dirname,'./dist/client','img')))
server.use('/js', express.static(path.join(__dirname, './dist/client', 'js')))
server.use(
  '/css',
  express.static(path.join(__dirname, './dist/client', 'css'))
)

server.use(
    '/favicon.ico',
    express.static(path.join(__dirname, './dist/client', 'favicon.ico'))
  )

const indexTemplate = fs.readFileSync(path.join(__dirname,'/dist/client/index.html'),'utf-8')

server.get('*',async (req,res)=>{
    const {app,router} = createApp();

    router.push(req.url)
    await router.isReady();

    const appContent = await renderToString(app);

    fs.readFile(path.join(__dirname,'/dist/client/index.html'),(err,html)=>{
        if(err){
            throw err
        }
        html = indexTemplate.toString().replace('<div id="app">',`<div id="app">${appContent}`)
        res.setHeader('Content-Type','text/html');
        
        res.end(html)
    })

     
})

console.log('You can navigate to http://localhost:8080')

server.listen(8080)
