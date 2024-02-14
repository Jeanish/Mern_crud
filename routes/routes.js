import express from "express";
import { User } from "../models/user.js";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// File(Image) Store Using Multer
var storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
  },
});

// Middleware for multer
var upload = multer({
  storage: storage,
}).single("image");

// Add user into Database
router.post("/add", upload, (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      image: req.file.filename,
    });

    user.save();
    req.session.message = {
      type: "success",
      message: "User added successfully",
    };
    res.redirect("/");
  } catch (error) {
    res.json({ message: error.message, type: "danger" });
  }
});

router.get("/", (req, res) => {
  User.find()
    .exec()
    .then((users) => {
      res.render("index.ejs", { title: "Home Page", users: users });
    })
    .catch((e) => {
      res.json({ message: e.message });
    });
});

router.get("/add", (req, res) => {
  res.render("add.ejs", { title: "Add User" });
});

router.get("/views/edit/:id", (req, res) => {
  var id = req.params.id;
  User.findById(id)
    .then((users) => {
      if (users == null) {
        res.redirect("/");
      } else {
        res.render("edit.ejs", { title: "Edit user", user: users });
      }
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
});

router.post("/update/:id", upload, (req, res) => {
  var id = req.params.id;
  let newImage = "";
  if (req.file) {
    newImage = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.oldImg);
    } catch (error) {
      console.log(error);
    }
  } else {
    newImage = req.body.oldImg;
  }

  User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    image: newImage,
  })
    .then((r) => {
      req.session.message = {
        type: "success",
        message: "User Updated Successfully",
      };
      res.redirect("/");
    })
    .catch((err) => {
      res.json({ message: err.message, type: "danger" });
    });
  // res.redirect("/");
  // (err, result) => {
  //   if (err) {
  //   } else {
  //     req.session.message = {
  //       type: "success",
  //       message: "User Updated Successfully",
  //     };
  //   }
  // }
  // );
});

export default router;
