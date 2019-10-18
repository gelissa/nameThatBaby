var express = require("express");
var passport = require("../config/passport");
var router = express.Router();
var db = require("../models");

router.get("/", function (req, res) {
  // console.log("This is babyName function: " + babyName);
  // console.log("This is user function: " + user);
  // res.render("index", { name: "hey" });
  res.render("index", { layout: "singular.handlebars" });
});

router.get("/login", function (req, res) {
  res.render("login", { layout: "singular.handlebars" });
});

 var postResults = [];

router.post("/search", function (req, res) {
  var genderChoice = req.body.gender;
  var ethnicityChoice = req.body.ethnicity;
  var startingLetter = req.body.startingLetter;
  var resultNum = parseInt(req.body.resultNum);
  console.log(startingLetter);

  db.BabyName.findAll({
    where: {
      sex: genderChoice,
      ethnicity: ethnicityChoice,
      name: { [db.Sequelize.Op.like]: startingLetter + "%" }
    },
    limit: resultNum
  }).then(function (results) {
    postResults = [];
    for (var index = 0; index < 10; index++) {
      console.log(results[index].name);
      postResults.push({
        name: results[index].name
      })
    }
    res.json(results)
  });
});

router.get("/names", function (req, res) {
  console.log(postResults);
  
  res.render("names", {postResults, helpers: {
    ifEven: function (index, options) {
      if (index % 2 === 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }});
});

// router.put("/api/burgers/:id", function (req, res) {
//   var condition = "id = " + req.params.id;
//   var dev = "devoured = " + req.body.devoured;

//   console.log("condition", condition);

//   burger.update(dev, condition, function (result) {
//     if (result.changedRows === 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });

// router.delete("/api/burgers/:id", function (req, res) {
//   var condition = "id = " + req.params.id;

//   burger.delete(condition, function (result) {
//     if (result.affectedRows === 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });

module.exports = router;
