var express = require('express');
var router = express.Router();
var http = require('http');

const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("5b088eaf1a59b150aefde869");

const service = new cloudrail.services.Telegram(
    null,
    "551055113:AAG7NC5L7UxRro1DWUQ1863U8D_X5jVrC4I",
    "https://intense-brushlands-95803.herokuapp.com/"
);

/* GET home page. */
router.get('/', function(req, res, next) {
	service.sendMessage(
    "219148418",
    "Hola Laura :)",
		(error, result) => {
			console.log("hay un error");
			// Check for potential error and use the result
		}
	);
  res.render('index', { title: 'Express' });
});

module.exports = router;
