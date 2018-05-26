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

var usuarios=[{user_id : "219148418", username : 'somethingxblue', estadoEncuesta : -1, cantidadEncuestasRespondidas : 0,respuestaPregunta1 : "SI", respuestaPregunta2 : "NO", respuestaPregunta3 : "SI" }];
var MENSAJE_BIENVENIDO = "Hola, tenemos una pequeña encuesta para que responda";
var PRIMERA_PREGUNTA = "Se encuentra actualmente trabajando? (SI/NO)";
var SEGUNDA_PREGUNTA_TRABAJANDO = "Esta en blanco?(SI/NO)";
var SEGUNDA_PREGUNTA_NO_TRABAJANDO  = "Se encuentra estudiando?(SI/NO)";
var MENSAJE_DESPEDIDA = "Muchas gracias por responder";

function recibirEncuesta(req,user_id,callback){
	var encuestado ;
	for (var i=0; i < usuarios.length; i++){
		if(usuarios[i].user_id == user_id){
			encuestado = usuarios[i];
		}
	}
	if(encuestado.estadoEncuesta ==0){
		//guardar en la base de datos
		callback();
	}
	else if(encuestado.estadoEncuesta ==1){
		encuestado.respuestaPregunta1 = req.body.message.text.toUpperCase();
		//guardar en la base de datos la respuesta
		callback();
	}
	else if(encuestado.estadoEncuesta ==2){
		encuestado.respuestaPregunta2 = req.body.message.text.toUpperCase();
		//guardar en la base de datos la respuesta
		callback();
	}
}

function mandarEncuesta(user_id,callback){
	for (var i=0; i < usuarios.length; i++){
		if(usuarios[i].user_id == user_id){
			encuestado = usuarios[i];
		}
	}
	if(encuestado.estadoEncuesta== -1){
		sendMessage(user_id,MENSAJE_BIENVENIDO);
		encuestado.estadoEncuesta += 1
		//crear una entrada en la base de datos para la encuesta
	}
	else if(encuestado.estadoEncuesta== 0){
		sendMessage(user_id,PRIMERA_PREGUNTA);
		encuestado.estadoEncuesta += 1
	}
	else if(encuestado.estadoEncuesta == 1){
		if(encuestado.respuestaPregunta1.toUpperCase()=="SI"){
			sendMessage(user_id,SEGUNDA_PREGUNTA_TRABAJANDO);
		}
		else{
			sendMessage(user_id,SEGUNDA_PREGUNTA_NO_TRABAJANDO);
		}
		encuestado.estadoEncuesta += 1
	}
	else if(encuestado.estadoEncuesta==2){
		sendMessage(user_id,MENSAJE_DESPEDIDA);
		encuestado.cantidadEncuestasRespondidas += 1;
		encuestado.estadoEncuesta = -1;
	}
	
	callback();
}

function enviarOfertaLaboral(req, user_id){
	sendMessage(user_id, "Tenemos una nueva oferta que podría interesarle!\n"+ req.body.payload);
	
}

function estaSiendoEncuestado(user_id){
	for (var i=0; i < usuarios.length; i++){
		if(usuarios[i].user_id == user_id && usuarios[i].estadoEncuesta > -1){
			return true;
		}
	}
	return false;
}

function sendMessage(user,message,callback){
	service.sendMessage(
    user,
    message,
		(error, result) => {
			if(error){ throw error;};
			console.log(typeof callback);
			if( callback !=undefined){
			callback();}
		}
	);
}

router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.post("/", function(req,res,next){
	console.log(req.body);
	if(req.method === "POST" && req.body.kind != undefined && req.body.kind == "encuestar"){
		var user_id = req.body.user_id;
		mandarEncuesta(user_id,function(){res.sendStatus(200)});
	}
	else if (req.method === "POST" && req.body.kind != undefined && req.body.kind == "mandarOfertaLaboral"){
		var user_id = req.body.user_id;
		enviarOfertaLaboral(req,user_id);
	}
	else{
		var user_id = req.body.message.from.id;
		if(user_id != undefined && estaSiendoEncuestado(user_id)){
				recibirEncuesta(req,user_id, function(){
					mandarEncuesta(user_id, function(){
						res.sendStatus(200)
					})
				});
		}
		else{
			res.sendStatus(200);
		}
	}
});

module.exports = router;
