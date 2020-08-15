//import constants file
const CONSTANTS = require("../CONSTANTS/constants");
const db = require("../../db");
const sdc = require("../../statsdclient");
const stopwatch = require("../../stopwatch");
//Function add new user
const addNewUser = (data, FILE_NAME) => {
  //Saving the data into the database.
  var query = `INSERT INTO users (firstname,lastname,email,password) VALUES ('${data.firstName}', '${data.lastName}','${data.email}', '${data.password}')`;

  return new Promise((resolve, reject) => {
    var watch=new stopwatch();
    watch.start();
    db.query(query, (err, rows) => {
      const delta = watch.read();
      sdc.timing("addUser", delta);
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
        reject(err);
      } else {
        CONSTANTS.createLogMessage(FILE_NAME, "User Data Inserted", "SUCCESS");
        resolve(rows);
      }
    });
  });
};

//Function update user
const updateUser = (req, res, next, data, FILE_NAME) => {
  //Saving the data into the database.
  var query = `UPDATE users SET firstname='${data.firstname}',lastname='${data.lastname}',email='${data.email}',password='${data.password}' where id=${data.id}`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
        CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
      } else {
        CONSTANTS.createLogMessage(FILE_NAME, "User Data updated", "SUCCESS");
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          data,
          next
        );
      }
    });
  });
};

//Function update book
const updateBook = (req, res, next, data, FILE_NAME) => {
  //Saving the data into the database.
  if (data.quantity <= 0 || data.quantity > 999) {
    CONSTANTS.createLogMessage(
      FILE_NAME,
      "Quantity should be greater than 0 and lesser than 1000",
      "ERROR"
    );
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.BAD_REQUEST,
      "Quantity should be greater than 0 and lesser than 1000",
      next
    );
    return;
  } else if (data.price < 0.01 || data.price > 9999.99) {
    CONSTANTS.createLogMessage(
      FILE_NAME,
      "Price should be greater than 0.00 and lesser than 10000",
      "ERROR"
    );
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.BAD_REQUEST,
      "Price should be greater than 0.00 and lesser than 10000",
      next
    );
    return;
  }

  var query = `UPDATE books SET isbn='${data.isbn}',title='${data.title}',authors='${data.authors}',publication='${data.publication}',quantity='${data.quantity}',price='${data.price}',userid='${data.userid}',isdeleted='0' where id=${data.id} and userid='${req.params.userID}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
        CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
      } else {
        var values = [];
        var bookImagesQuery = `INSERT INTO book_images (bookid,userid,isbn,imageurl,imagename) VALUES ?`;
        data.images.forEach((v) => {
          var temp = [];
          temp.push(data.id);
          temp.push(req.params.userID);
          temp.push(data.isbn);
          temp.push(v.Location);
          temp.push(v.Key);
          values.push(temp);
        });
        db.query(bookImagesQuery, [values], (err, rows) => {
          if (err) {
            CONSTANTS.createResponses(
              res,
              CONSTANTS.ERROR_CODE.FAILED,
              err,
              next
            );
          } else {
            CONSTANTS.createLogMessage(
              FILE_NAME,
              "Book Image Inserted",
              "SUCCESS"
            );
            CONSTANTS.createResponses(
              res,
              CONSTANTS.ERROR_CODE.SUCCESS,
              data,
              next
            );
          }
        });
      }
    });
  });
};

//Function to add book to cart
const addToCart = (req, res, next, data, FILE_NAME) => {
  //Saving the data into the database
  let total = data.quantity * data.price;
  var query = `INSERT INTO cart (bookid,quantity,userid) VALUES ('${data.bookid}','${data.quantity}', '${req.params.userID}')`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
        CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          "Inserted book into cart successfully!",
          "SUCCESS"
        );
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          data,
          next
        );
      }
    });
  });
};

//Fuction to add a new book
const addNewBook = (req, res, next, data, FILE_NAME) => {
  //Saving the data into the database.
  if (data.quantity <= 0 || data.quantity > 999) {
    CONSTANTS.createLogMessage(
      FILE_NAME,
      "Quantity should be greater than 0 and lesser than 1000",
      "ERROR"
    );
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.BAD_REQUEST,
      "Quantity should be greater than 0 and lesser than 1000",
      next
    );
    return;
  } else if (data.price < 0.01 || data.price > 9999.99) {
    CONSTANTS.createLogMessage(
      FILE_NAME,
      "Price should be greater than 0.00 and lesser than 10000",
      "ERROR"
    );
    CONSTANTS.createResponses(
      res,
      CONSTANTS.ERROR_CODE.BAD_REQUEST,
      "Price should be greater than 0.00 and lesser than 10000",
      next
    );
    return;
  }
  var query = `INSERT INTO books (isbn,title,authors,publication,quantity,price,userid) VALUES ('${data.isbn}', '${data.title}','${data.authors}', '${data.publication}', '${data.quantity}', '${data.price}','${req.params.userID}')`;
  return new Promise((resolve, reject) => {
    var watch=new stopwatch();
    watch.start();
    db.query(query, (err, rows) => {
      const delta = watch.read();
      sdc.timing("addNewBook", delta);
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
        CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
      } else {
        console.log(data.images);
        CONSTANTS.createLogMessage(FILE_NAME, "Book Inserted", "SUCCESS");
        var values = [];
        var bookImagesQuery = `INSERT INTO book_images (bookid,userid,isbn,imageurl,imagename) VALUES ?`;
        data.images.forEach((v) => {
          var temp = [];
          temp.push(rows.insertId);
          temp.push(req.params.userID);
          temp.push(data.isbn);
          temp.push(v.Location);
          temp.push(v.Key);
          values.push(temp);
        });
        db.query(bookImagesQuery, [values], (err, rows) => {
          if (err) {
            CONSTANTS.createResponses(
              res,
              CONSTANTS.ERROR_CODE.FAILED,
              err,
              next
            );
          } else {
            CONSTANTS.createLogMessage(
              FILE_NAME,
              "Book Image Inserted",
              "SUCCESS"
            );
            CONSTANTS.createResponses(
              res,
              CONSTANTS.ERROR_CODE.SUCCESS,
              data,
              next
            );
          }
        });
      }
    });
  });
};

//Fuction to get books
const getBooks = (req, res, next, data, FILE_NAME) => {
  //Saving the data into the database.
  if (req.query.bookid !== undefined && req.query.bookid !== null) {
    //    var query = `select * from books where userid='${req.params.userID}' and id='${req.query.bookid}' and quantity<>0`;
    var query = `select b.*,i.imagename,i.imageurl from books b inner join book_images i on b.id=i.bookid where b.userid='${req.params.userID}' and b.id='${req.query.bookid}' and quantity<>0`;

    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err,
            next
          );
        } else {
          var output = [];
          for (var i = 0; i < rows.length; i++) {
            if (output.filter((v) => v.id === rows[i].id).length > 0) {
              //already present
              var imagelist = output.find((v) => v.id === rows[i].id).images;
              imagelist.push({
                imagename: rows[i].imagename,
                imageurl: rows[i].imageurl,
              });
            } else {
              var imagelist = [];
              imagelist.push({
                imagename: rows[i].imagename,
                imageurl: rows[i].imageurl,
              });
              rows[i]["images"] = imagelist;
              output.push(rows[i]);
            }
          }
          console.log(output);
          CONSTANTS.createLogMessage(FILE_NAME, "Book Retrieved!", "SUCCESS");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            output,
            next
          );
        }
      });
    });
  } else {
    var query = `select b.*,i.imagename,i.imageurl from books b inner join book_images i on b.id=i.bookid where b.userid='${req.params.userID}' and quantity<>0`;
    //var query = `select * from books where userid='${req.params.userID}' and quantity<>0`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err,
            next
          );
        } else {
          var output = [];
          for (var i = 0; i < rows.length; i++) {
            if (output.filter((v) => v.id === rows[i].id).length > 0) {
              //already present
              var imagelist = output.find((v) => v.id === rows[i].id).images;
              imagelist.push({
                imagename: rows[i].imagename,
                imageurl: rows[i].imageurl,
              });
            } else {
              var imagelist = [];
              imagelist.push({
                imagename: rows[i].imagename,
                imageurl: rows[i].imageurl,
              });
              rows[i]["images"] = imagelist;
              delete rows[i]["imagename"];
              delete rows[i]["imageurl"];
              output.push(rows[i]);
            }
          }
          console.log("testing" + JSON.stringify(output));

          CONSTANTS.createLogMessage(FILE_NAME, "Books Retrieved!", "SUCCESS");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            output,
            next
          );
        }
      });
    });
  }
};

//Fuction to get cart item
const getCartItem = (req, res, next, data, FILE_NAME) => {
  //Saving the data into the database.
  if (req.query.cartid !== undefined && req.query.cartid !== null) {
    var query = `select c.id as cartID,b.id as bookID,c.quantity as cartQuantity,b.quantity as bookQuantity,c.*,b.* from cart c inner join books b on b.id=c.bookid where c.userid='${req.params.userID}' and c.id='${req.query.cartid}'`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err,
            next
          );
        } else {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            "Cart item retrieved!",
            "SUCCESS"
          );
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            rows,
            next
          );
        }
      });
    });
  } else {
    var query = `select c.id as cartID,b.id as bookID,c.quantity as cartQuantity,b.quantity as bookQuantity,c.*,b.* from cart c inner join books b on b.id=c.bookid where c.userid='${req.params.userID}'`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err,
            next
          );
        } else {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            "Cart itesm Retrieved!",
            "SUCCESS"
          );
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            rows,
            next
          );
        }
      });
    });
  }
};

//Fuction to get buyer books
const getImagesFromDb = (req, res, next, data, FILE_NAME) => {
  console.log(req.query.isbn);
  //Saving the data into the database.
  var query = `select * from book_images where isbn='${req.query.isbn}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
        CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
      } else {
        CONSTANTS.createLogMessage(FILE_NAME, "Book Retrieved!", "SUCCESS");
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          rows,
          next
        );
      }
    });
  });
};

//Fuction to get buyer books
const getBuyerBooks = (req, res, next, data, FILE_NAME) => {
  //Saving the data into the database.
  if (req.query.bookid !== undefined && req.query.bookid !== null) {
    var query = `select c.quantity as cartQuantity,b.* from books b left join cart c on c.bookid=b.id and c.userid='${req.params.userID}'  where b.userid<>'${req.params.userID}' and id='${req.query.bookid}' and isdeleted<>'1' and b.quantity<>'0' order by isbn asc,price asc,quantity asc;`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err,
            next
          );
        } else {
          CONSTANTS.createLogMessage(FILE_NAME, "Book Retrieved!", "SUCCESS");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            rows,
            next
          );
        }
      });
    });
  } else {
    var query = `select c.quantity as cartQuantity,b.* from books b left join cart c on c.bookid=b.id and c.userid='${req.params.userID}' where b.userid<>'${req.params.userID}' and isdeleted<>'1' and b.quantity<>'0' order by isbn asc,price asc,quantity asc;`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err,
            next
          );
        } else {
          CONSTANTS.createLogMessage(FILE_NAME, "Books Retrieved!", "SUCCESS");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            rows,
            next
          );
        }
      });
    });
  }
};
//Fucntion to delete books from db
const deleteBookImageFromDb = (req, res, next, data, FILE_NAME) => {
  var query = `delete from book_images where imagename='${req.query.key}'`;

  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
        CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          `Delete book image with the specified id ${req.query.key}`,
          "SUCCESS"
        );
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          rows,
          next
        );
      }
    });
  });
};

//Fucntion to delete books
const deleteBooks = (req, res, next, data, FILE_NAME) => {
  if (req.query.bookid !== undefined && req.query.bookid !== null) {
    var query = `update books set isdeleted=1 where userid='${req.params.userID}' and id='${req.query.bookid}'`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err,
            next
          );
        } else {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            `Delete book with the specified id ${req.query.bookid}`,
            "SUCCESS"
          );
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            rows,
            next
          );
        }
      });
    });
  } else {
    var query = `update books set isdeleted='1' where userid='${req.params.userID}'`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err,
            next
          );
        } else {
          CONSTANTS.createLogMessage(FILE_NAME, `Delete books`, "SUCCESS");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            rows,
            next
          );
        }
      });
    });
  }
};

//Fucntion to delete cart items
const deleteCartItem = (req, res, next, data, FILE_NAME) => {
  if (req.query.cartid !== undefined && req.query.cartid !== null) {
    var query = `delete from cart where userid='${req.params.userID}' and id='${req.query.cartid}'`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err,
            next
          );
        } else {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            `Delete cart items with the specified cart id ${req.query.cartid}`,
            "SUCCESS"
          );
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            rows,
            next
          );
        }
      });
    });
  } else {
    var query = `delete from cart where userid='${req.params.userID}'`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.FAILED,
            err,
            next
          );
        } else {
          CONSTANTS.createLogMessage(
            FILE_NAME,
            `Deleted all user cart items`,
            "SUCCESS"
          );
          CONSTANTS.createResponses(
            res,
            CONSTANTS.ERROR_CODE.SUCCESS,
            rows,
            next
          );
        }
      });
    });
  }
};

//Function update cart items
const updateCartItem = (req, res, next, data, FILE_NAME) => {
  //Saving the data into the database.

  var query = `UPDATE cart SET quantity='${data.quantity}' where id='${req.query.cartid}' and userid='${req.params.userID}'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, rows) => {
      if (err) {
        CONSTANTS.createLogMessage(FILE_NAME, err.sqlMessage, "ERROR");
        CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
      } else {
        CONSTANTS.createLogMessage(
          FILE_NAME,
          "Cart item quantity updated",
          "SUCCESS"
        );
        CONSTANTS.createResponses(
          res,
          CONSTANTS.ERROR_CODE.SUCCESS,
          data,
          next
        );
      }
    });
  });
};

//Export the modules
module.exports = {
  addNewUser,
  updateUser,
  addNewBook,
  getBooks,
  updateBook,
  deleteBooks,
  getBuyerBooks,
  addToCart,
  getCartItem,
  deleteCartItem,
  updateCartItem,
  deleteBookImageFromDb,
  getImagesFromDb,
};
