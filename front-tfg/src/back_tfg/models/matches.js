"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Modelo de la tabla usaurios
var UserSchema = Schema({
  fecha_partida: String,
  puntuacion_maxima_partida: Number,
  puntuacion_minima_partida: Number,
  creador_partida: {
    type: Schema.ObjectId,
    ref: "users",
  },
  contrincante_partida: {
    type: Schema.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("matches", MatchSchema);
