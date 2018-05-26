var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("5b088eaf1a59b150aefde869");

const service = new cloudrail.services.Telegram(
    null,
    "551055113:AAG7NC5L7UxRro1DWUQ1863U8D_X5jVrC4I",
    "https://intense-brushlands-95803.herokuapp.com/"
);

router.use(bodyParser.json());

/*
function parsearMensajeRecivido (){
	service.parseReceivedMessages(
		readableStream,
		(error, result) => {
			console.log(result);
			console.log(JSON.stringify(result));
			// Check for potential error and use the result
		}
	)
}
*/
function encuestar(user){
	var x;
}

function sendMessage(user,message){
	service.sendMessage(
    user,
    message,
		(error, result) => {if(error){ console.log("hubo un error");}
		}
	);
}


router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post("/", function(req,res,next){
	if(req.method ==="POST" && req.body.kind != undefined && req.body.kind == "encuestar"){
		var user_id = req.body.user_id;
		var message = req.body.message;
		sendMessage(user_id, message);
		
	}
	else{
		
	}
	res.sendStatus(200);
});

module.exports = router;
