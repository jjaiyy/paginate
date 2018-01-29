import path from "path";
import bodyParser from "body-parser";
import morgan from "morgan";
import express from "express";

import http from "http";
import logger from "morgan";
import methodOverride from "method-override";
import errorHandler from "errorhandler";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";
import expressPaginate from "express-paginate";
import url from "url";
import bluebird from "bluebird";

const app = express();

app.set("port", process.env.PORT || 8080);
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(expressPaginate.middleware(10, 50));

import postsData from "./contacts";

mongoose.Promise = bluebird;
const myblog = mongoose.connect("mongodb://localhost:27017/paginate", {
  useMongoClient: true
});
mongoose.connection.openUri("mongodb://localhost:27017/paginate", () => {
  console.log("Mongoose connected!");
});

const postsSchema = new mongoose.Schema({
  title: { type: String },
  link: { type: String },
  view: { type: String },
  updated: { type: String }
});
postsSchema.plugin(mongoosePaginate);
const Posts = mongoose.model("Post", postsSchema);

postsData.map(value => {
  let item = new Posts(value);
  item.save((error, result) => {
    if (error) {
      throw error;
    }
  });
});

app.get("/api", (req, res) => {
  const get_params = url.parse(req.url, true).query;
  if (Object.keys(get_params).length == 0) {
    Posts.find({}, (error, result) => {
      if (error) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal server error");
        return;
      }
      if (res != null) {
        res.setHeader("Content-Type", "application/json");
        res.send({
          object: "contacts",
          result: result
        });
      }
    });
  } else {
    Posts.paginate(
      {},
      {
        page: req.query.page,
        limit: req.query.limit
      },
      (error, result) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal server error");
          return;
        }
        res.setHeader("Content-Type", "application/json");
        res.send({
          object: "contacts",
          page_count: result.pages,
          result: result
        });
      }
    );
  }
});

console.log("Running at port " + app.get("port"));
http.createServer(app).listen(app.get("port"));
