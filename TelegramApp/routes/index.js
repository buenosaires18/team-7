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
/*
function parsearMensajeRecivido (){
	service.parseReceivedMessages(
		readableStream,
		(error, result) => {
			// Check for potential error and use the result
		}
	)	
}
*/
function sendMessage(user,message){
	service.sendMessage(
    user,
    message,
		(error, result) => {
			if(error){ console.log("hubo un error");}
			// Check for potential error and use the result
		}
	);
}

router.get('/', function(req, res, next) {
	sendMessage("219148418","holaaaa");
  res.render('index', { title: 'Express' });
});

router.post("/",function(req,res,next){
	if(req.method ==="POST"){
		console.log(req.body);
		var user_id = req.body.user_id;
		var message = req.body.message;
		sendMessage(user_id, message);
	}
});

module.exports = router;
