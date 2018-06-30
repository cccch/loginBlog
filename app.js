"use strict"
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const router = require('./router');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
//设置模板引擎
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
//静态资源
app.use('/www',express.static(__dirname+'/www'));
//引入body-parser包利于使用req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//引用路由
app.use(router);

app.listen(4000,function(){
    console.log('开始监控');
})