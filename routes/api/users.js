const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const multer = require("multer");
const uploadMiddleware = multer().single("avatar");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const { validation, authentic } = require("../../middlewares");
const { schemas } = require("../../models/user");
const { ctrlWrapper } = require("../../helpers");

router.get(
  "/current",
  authentic,
  ctrlWrapper((req, res, next) => {
    const userId = req.user.id;
    const sql = "SELECT * FROM users WHERE id = " + mysql.escape(userId);
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return next(err);
      }
      res.json(result);
    });
  })
);

router.patch(
  "/",
  authentic,
  validation(schemas.subscriptionSchema),
  ctrlWrapper((req, res, next) => {
    const userId = req.user.id;
    const { subscription } = req.body;
    const sql =
      "UPDATE users SET subscription = " +
      mysql.escape(subscription) +
      " WHERE id = " +
      mysql.escape(userId);
    db.query(sql, [subscription, userId], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return next(err);
      }
      res.json(result);
    });
  })
);

router.patch(
  "/avatars",
  authentic,
  uploadMiddleware,
  ctrlWrapper((req, res, next) => {
    const userId = req.user.id;
    const avatarUrl = req.file.url;
    const sql =
      "UPDATE users SET avatar = " +
      mysql.escape(avatarUrl) +
      " WHERE id = " +
      mysql.escape(userId);
    db.query(sql, [avatarUrl, userId], (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return next(err);
      }
      res.json(result);
    });
  })
);

module.exports = router;
