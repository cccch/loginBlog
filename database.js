//封装操作数据库的函数
module.exports = function(str,callback){
    var mysql = require('mysql');
    var pool  = mysql.createPool({
        connectionLimit : 100,
        host            : 'localhost',
        user            : 'root',
        password        : 'root',
        database        : 'blog'
    });
    pool.getConnection(function(err, connection) {
    connection.query(str, function (error, results, fields) {
        connection.release();
        if (error) return callback(err,null);
        callback(null,results);

    });
});

}