//import constants file
const CONSTANTS = require("../CONSTANTS/constants");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});
const sdc = require("../../statsdclient");
const stopwatch = require("../../stopwatch");

//Function upload images to s3
const uploadImages = (req, res, next, data, FILE_NAME) => {
  var promises = [];
  for (var i = 0; i < req.body.length; i++) {
    var file = req.body[i];
    console.log("single file " + file);
    promises.push(uploadLoadToS3(file));
  }
  var watch = new stopwatch();
  watch.start();
  Promise.all(promises)
    .then(function (data) {
      const delta = watch.read();
      sdc.timing("uploadImages_S3", delta);
      CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.SUCCESS, data, next);
    })
    .catch(function (err) {
      CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
    });
};

const forgotPassword = (req, res, next) => {
  // Create publish parameters
  var obj = {
    toEmail: req.body.email,
  };
  var params = {
    Message: JSON.stringify(obj) /* required */,
    TopicArn: "arn:aws:sns:us-east-1:708663795942:forgotPassword",
  };

  // Create promise and SNS service object
  var publishTextPromise = new AWS.SNS({
    apiVersion: "2010-03-31",
    region:"us-east-1"
  })
    .publish(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  publishTextPromise
    .then(function (data) {
      console.log(
        `Message ${params.Message} send sent to the topic ${params.TopicArn}`
      );

      console.log("MessageID is " + data.MessageId);
      CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.SUCCESS, data, next);
    })
    .catch(function (err) {
      CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
    });
};

//Function get seller images from s3
const getSellerBookImages = (req, res, next, data, FILE_NAME) => {
  var promises = [];
  for (var i = 0; i < req.body.length; i++) {
    var file = req.body[i];
    promises.push(getLoadFromS3(file));
  }
  var watch = new stopwatch();
  watch.start();
  Promise.all(promises)
    .then(function (data) {
      const delta = watch.read();
      sdc.timing("getSellerBookImages_S3", delta);
      var output = [];
      data.forEach((v, index) => {
        output.push({
          imageBlob: v.Body.toString("utf-8"),
          contentType: v.ContentType,
          lastModified: v.LastModified,
          imagename: req.body[index].imagename,
        });
      });
      CONSTANTS.createResponses(
        res,
        CONSTANTS.ERROR_CODE.SUCCESS,
        output,
        next
      );
    })
    .catch(function (err) {
      CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
    });
};

function uploadLoadToS3(ObjFile) {
  var params = {
    ACL: "public-read",
    Body: ObjFile.imageBlob,
    Bucket: process.env.S3_BUCKET_NAME,
    ContentType: ObjFile.type,
    Key: ObjFile.name,
  };
  return s3.upload(params).promise();
}
function getLoadFromS3(ObjFile) {
  var params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: ObjFile.imagename,
  };
  return s3.getObject(params).promise();
}

function deleteImageFromS3(key) {
  var params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };
  return s3.deleteObject(params).promise();
}

//Function delete image from s3
const deleteBookImage = (req, res, next, data, FILE_NAME) => {
  var promises = [];
  promises.push(deleteImageFromS3(req.query.key));
  var watch = new stopwatch();
  watch.start();
  Promise.all(promises)
    .then(function (data) {
      const delta = watch.read();
      sdc.timing("deleteBookImage_S3", delta);
      CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.SUCCESS, data, next);
    })
    .catch(function (err) {
      CONSTANTS.createResponses(res, CONSTANTS.ERROR_CODE.FAILED, err, next);
    });
};

//Export the modules
module.exports = {
  uploadImages,
  getSellerBookImages,
  deleteBookImage,
  forgotPassword,
};
