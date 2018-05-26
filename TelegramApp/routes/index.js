var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');

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

var usuarios=[{user_id : "219148418", encuestando : false, username : 'somethingxblue', estadoEncuesta : -1 }];
var MENSAJE_BIENVENIDO = "Hola, tenemos una pequeña encuesta para que responda";
var PRIMERA_PREGUNTA = "Se encuentra actualmente trabajando?";
var SEGUNDA_PREGUNTA_TRABAJANDO = "Esta en blanco?";
var SEGUNDA_PREGUNTA_NO_TRABAJANDO  = "Se encuentra estudiando?";
var MENSAJE_DESPEDIDA = "Muchas gracias por responder";


function encuestar(user_id,callback){
	var encuestado ;
	for (var i=0; i < usuarios.length; i++){
		if(usuarios[i].user_id == user_id){
			encuestado = usuarios[i];
		}
	}
	if(encuestado.estadoEncuesta== -1){
		sendMessage(user_id,MENSAJE_BIENVENIDO);
		encuestado.encuestando = true;
	}
	else if(encuestado.estadoEncuesta== 0){
		sendMessage(user_id,PRIMERA_PREGUNTA);
	}
	else if(encuestado.estadoEncuesta== 1){
		
	}
	else if(encuestado.estadoEncuesta==2){
		sendMessage(user_id,MENSAJE_DESPEDIDA);
		encuestado.encuestando = false;
	}
	encuestado.estadoEncuesta += 1
	callback();
}

function estaSiendoEncuestado(user_id){
	for (var i=0; i < usuarios.length; i++){
		if(usuarios[i].user_id == user_id && usuarios[i].encuestando = true){
			return true;
		}
	}
	return false;
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
	if(req.method === "POST" && req.body.kind != undefined && req.body.kind == "encuestar"){
		var user_id = req.body.user_id;
		encuestar(user_id,function(){res.sendStatus(200)});
	}
	else{
		console.log(req.body.message.from.id);
		var user_id = req.body.message.from.id;
		
		if(user_id != undefined){
			if(estaSiendoEncuestado(user_id)){
				encuestar(user_id,function(){res.sendStatus(200)});
			}
			else{
				sendMessage(user_id,"Mensaje cualquiera");
			}
		}
		
		
		
	}

	res.sendStatus(200);
});

module.exports = router;
