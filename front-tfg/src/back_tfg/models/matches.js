"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Modelo de la tabla usaurios
var MatchSchema = Schema({
  fecha_partida: String,
  puntuacion_maxima_partida: Number,
  puntuacion_minima_partida: Number,
  creador_partida: String,
  contrincante_partida: String,
});

module.exports = mongoose.model("matches", MatchSchema);
