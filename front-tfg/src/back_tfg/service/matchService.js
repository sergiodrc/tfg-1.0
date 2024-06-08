let userService = require("../service/userService");

let user = require('../models/user')
let matchModel = require('../models/matches')

async function createMatchBD(matchDetails) {
    try {
        let matchModelData = new matchModel();
        matchModelData.fecha_partida = matchDetails.fecha_partida;
        matchModelData.puntuacion_maxima_partida = matchDetails.puntuacion_maxima_partida;
        matchModelData.puntuacion_minima_partida = matchDetails.puntuacion_minima_partida;
        matchModelData.creador_partida = matchDetails.creador_partida;
        matchModelData.contrincante_partida = ""; // Esta seteado como campo vacio porque al principio no tiene que haber contrincante hasta que otro la acepte

        console.log("Datos del partido antes de guardar:", matchModelData);
        // matchModelData.creador_partida = "admin@gmail.com";
        let result = await matchModelData.save();

        console.log("Resultado de la inserción en la base de datos:", result);

        if (result) {
            return { status: true, message: "Partida creada" };
        } else {
            return { status: false, message: "Error al crear la partida" };
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
        });
        if (result.deletedCount > 0) {
            return { status: true, msg: "Match deleted successfully" };
        } else {
            return { status: false, msg: "Match not found" };
        }
    } catch (err) {
        console.error(err);
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
            return { status: false, message: "No Se ha salido a la partida" };async function deleteMatchBD(matchDetails) {
    try {
        let result = await matchModel.deleteOne({
            _id: matchDetails._id
        });
        if (result.deletedCount > 0) {
            return { status: true, msg: "Match deleted successfully" };
        } else {
            return { status: false, msg: "Match not found" };
        }
    } catch (err) {
        console.error(err);
        return { status: false, msg: "Problems with Match delete" };
    }
}
        }
    } catch(err) {
        return { status: false, message: "error al salirse a la partida" };
    }
}

async function getAllMatchesBD() {
    try {
        const result = await matchModel.find({});
        if (result) {
            return { status: true, message: "Todas las partidas", matches: result };
        } else {
            return { status: false, message: "Error al sacar las partidas" };
        }
    } catch (error) {
        console.error(error);
        return {status: false, message: "No se han podido sacar las partidas"};
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
            creador_partida: matchDetails.email_usuario
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