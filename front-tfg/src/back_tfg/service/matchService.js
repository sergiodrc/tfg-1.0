let userService = require("../service/userService");

let user = require('../models/user')
let matchModel = require('../models/matches')

async function createMatchBD(matchDetails) {
    try {
        let matchModelData = new matchModel();
        matchModelData.fecha_partida = matchDetails.fecha_partida;
        matchModelData.puntuacion_maxima_partida = matchDetails.puntuacion_maxima_partida;
        matchModelData.puntuacion_minima_partida = matchDetails.puntuacion_minima_partida;
        matchModelData.creador_partida = matchDetails.nickname_usuario;
        matchModelData.contrincante_partida = ""; //Esta seteado como campo vacio xq al principio no tiene q haber contrincante hasta que otro la acepte

        let result = await matchModelData.save()
        console.log(result)

        if (result) {
            return { status: true, message: "partida creada" };
        } else {
            return { status: false, message: "error al crear la partida" };
        }
    } catch(err) {
        console.error(err);
        return { status: false, message: 'Error al guardar la partida en la base de datos' };
    }
}

async function deleteMatchBD(matchDetails) {
    try {
        let result = await matchModel.deleteOne({
            _id: matchDetails._id
        })
        if(result) {
            return { status: true, msg: "Match delete successfully" };
          } else {
            return { status: false, msg: "Problems with Match delete" };
          }
    } catch (err) {
        return { status: false, msg: "Problems with Match delete" };
    }
}

async function joinMatchBD(matchDetails) {
    try {
        let result = await matchModel.updateOne(
            {_id: matchDetails._id},
            {contrincante_partida: matchDetails.nickname_usuario}
        );
        if (result) {
            return { status: true, message: "Se ha unido a la partida" };
        } else {
            return { status: false, message: "No Se ha unido a la partida" };
        }
    } catch(err) {
        return { status: false, message: "error al unirse a la partida" };
    }
}

async function leaveMatchBD(matchDetails) {
    try {
        let result = await matchModel.updateOne(
            {_id: matchDetails._id},
            {contrincante_partida: ""}
        );
        if (result) {
            return { status: true, message: "Se ha salido a la partida" };
        } else {
            return { status: false, message: "No Se ha salido a la partida" };
        }
    } catch(err) {
        return { status: false, message: "error al salirse a la partida" };
    }
}

async function getAllMatchesBD() {
    try {
        let result = await matchModel.find({})
        console.log(result)
        if (result) {
            return { status: true, message: "Todas las partidas" };
        } else {
            return { status: false, message: "Error al sacar las partidas" };
        }
    } catch (error) {
        return {status: false, message: "No se han podido sacar las partidas"}
    }
}

async function updateMatchBD(matchDetails) {
    try {
        let result = await matchModel.updateOne(
            {_id: matchDetails._id},
            {
                fecha_partida:matchDetails.fecha_partida,
                puntuacion_maxima_partida: matchDetails.puntuacion_maxima_partida,
                puntuacion_minima_partida: matchDetails.puntuacion_minima_partida
            }
        )
        if (result) {
            return { status: true, msg: "Partida actualizada con exito"};
          } else {
            return { status: false, msg: "No se pudo actualizar la partida" };
          }
    } catch(err) {
        return { status: false, msg: "Error al actualizar la partida" };
    }
}

async function getMyMatchesBD(matchDetails) {
    try {
        let result = await matchModel.find({
            creador_partida: matchDetails.nickname_usuario
        })
        console.log(result)
        if(result) {
            return { status: true, message: "Todas tus partidas" };
        } else {
            return { status: false, message: "Error al sacar tus partidas" };
        }
    } catch(err) {
        return { status: false, message: "Error"}
    }
}

module.exports = {createMatchBD, deleteMatchBD, joinMatchBD, leaveMatchBD, getAllMatchesBD, updateMatchBD, getMyMatchesBD}