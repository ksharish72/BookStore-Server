const mysql = require("mysql");

const MYSQL_DB_URL = "localhost";
const MYSQL_USERNAME = "root";
const MYSQL_PASSWORD = "Ssnsmhb1996$";
const MYSQL_DATABASE = "master";
//mysql connection
var mysqlConnection = mysql.createConnection({
  host: MYSQL_DB_URL,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});
mysqlConnection.connect();
// insert statment
let stmt = `INSERT INTO books (isbn,title,authors,publication,quantity,price,userid,addedtime,updatedtime,isdeleted) VALUES ? `;
let todos = [];
var d = new Date();
var mm = d.getMonth() + 1;
var dd = d.getDate();
var yy = d.getFullYear();
var myDateString = yy + "-" + mm + "-" + dd; //(US)

var current =
  myDateString +
  " " +
  d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

for (var i = 0; i < 50; i++) {
  var isbn = makeid(10);
  var title = makeid(10);
  var authors = makeid(10);
  var publication = randomDate(new Date(2000, 1, 1), new Date());
  var quantity = randomIntFromInterval(1, 999);
  var price = randomIntFromInterval(1, 9999);
  var userid = randomIntFromInterval(1, 10);
  var addedtime = current;
  var updatedtime = current;
  var isDeleted = 0;
  todos.push([
    isbn,
    title,
    authors,
    publication,
    quantity,
    price,
    userid,
    addedtime,
    updatedtime,
    isDeleted,
  ]);
}
function makeid(length) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}
// execute the insert statment
mysqlConnection.query(stmt, [todos], (err, results, fields) => {
  if (err) {
    return console.error(err.message);
  }
  // get inserted rows
  console.log("Row inserted:" + results.affectedRows);
});
mysqlConnection.end();
