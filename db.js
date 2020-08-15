const mysql = require("mysql");
const CONSTANTS = require("./src/CONSTANTS/constants");
const FILE_NAME = "server.js";

const MYSQL_DB_URL = process.env.MYSQL_DB_URL;
const MYSQL_USERNAME = process.env.MYSQL_USERNAME;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_PORT = process.env.MYSQL_PORT;
//mysql connection
var mysqlConnection = mysql.createConnection({
  host: MYSQL_DB_URL,
  port: MYSQL_PORT,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  multipleStatements: true,
});
mysqlConnection.connect((err) => {
  if (err) {
    CONSTANTS.createLogMessage(FILE_NAME, err, "MYSQLCONNECTIONERROR");
  } else {
    CONSTANTS.createLogMessage(
      FILE_NAME,
      "Connection established to " + MYSQL_DB_URL,
      "MYSQLCONNECTIONSUCCESS"
    );
    dbSchema();
  }
});

function dbSchema() {
  var database = MYSQL_DATABASE;
  var query = ``;
  query += `create database if not exists ${database};`;
  query += `use ${database};`;
  query += `CREATE TABLE \`books\` ( 
    \`id\` int(11) NOT NULL AUTO_INCREMENT,
    \`isbn\` text,
    \`title\` text,
    \`authors\` text,
    \`publication\` date DEFAULT NULL,
    \`quantity\` int(11) DEFAULT NULL,
    \`price\` double DEFAULT NULL,
    \`userid\` int(11) DEFAULT NULL,
    \`addedtime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updatedtime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    \`isdeleted\` tinyint(1) DEFAULT '0',
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`isbn\` (\`isbn\`(255),\`userid\`)
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;`;
  query += `CREATE TABLE \`cart\` (
    \`id\` int(11) NOT NULL AUTO_INCREMENT,
    \`bookid\` int(11) DEFAULT NULL,
    \`quantity\` int(11) DEFAULT NULL,
    \`userid\` int(11) DEFAULT NULL,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`bookid\` (\`bookid\`,\`userid\`)
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;`;
  query += `CREATE TABLE \`users\` (
    \`id\` int(11) NOT NULL AUTO_INCREMENT,
    \`firstname\` varchar(20) DEFAULT NULL,
    \`lastname\` varchar(20) DEFAULT NULL,
    \`email\` varchar(32) DEFAULT NULL,
    \`password\` varchar(255) DEFAULT NULL,
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;`;
  query += `create table book_images (id int not null auto_increment, bookid int, userid int, isbn varchar(255),imageurl varchar(255), imagename varchar(255), primary key (id),unique key (bookid,userid,imageurl));`;

  mysqlConnection.query(query, (err, rows) => {
    if (err) {
      CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
    } else {
      CONSTANTS.createLogMessage(
        FILE_NAME,
        "Schema successfully created",
        "SUCCESS"
      );
    }
  });
}
module.exports = mysqlConnection;
