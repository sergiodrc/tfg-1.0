let userService = require("../service/userService");
let matchModel = require('../models/matches');

// Funciona en el back y en el front
async function createMatchBD(matchDetails) {
    try {
        let matchModelData = new matchModel();
        matchModelData.fecha_partida = matchDetails.fecha_partida;
        matchModelData.puntuacion_maxima_partida = matchDetails.puntuacion_maxima_partida;
        matchModelData.puntuacion_minima_partida = matchDetails.puntuacion_minima_partida;
        matchModelData.creador_partida = matchDetails.creador_partida;
        matchModelData.contrincante_partida = ""; // Esta seteado como campo vacío porque al principio no debe haber contrincante hasta que otro lo acepte

        console.log("Datos del partido antes de guardar:", matchModelData);

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

// Funciona en el back y en el front
async function deleteMatchBD(matchDetails) {
    try {
        let result = await matchModel.deleteOne({
            _id: matchDetails._id,
            creador_partida: matchDetails.correo
        });
        if (result.deletedCount > 0) {
            return { status: true, msg: "Partida eliminada correctamente" };
        } else {
            return { status: false, msg: "Partida no encontrada o no tiene permiso para eliminarla" };
        }
    } catch (err) {
        console.error(err);
        return { status: false, msg: "Error al eliminar partida" };
    }
}
async function joinMatchBD(matchId, userEmail) {
    try {
        console.log(`Attempting to join match with ID: ${matchId} by user: ${userEmail}`);
        
        // Verificar el estado actual del documento
        let match = await matchModel.findById(matchId);
        if (!match) {
            return { status: false, message: "Partida no encontrada" };
        }

        if (match.contrincante_partida === userEmail) {
            return { status: false, message: "Ya está unido a esta partida" };
        }

        let result = await matchModel.updateOne(
            { _id: matchId },
            { contrincante_partida: userEmail }
        );

        console.log(`Update result: ${JSON.stringify(result)}`);

        if (result.matchedCount === 0) {
            return { status: false, message: "Partida no encontrada" };
        } else if (result.modifiedCount > 0) {
            return { status: true, message: "Se ha unido a la partida" };
        } else {
            return { status: false, message: "No se ha unido a la partida" };
        }
    } catch (err) {
        console.error(`Error joining match: ${err}`);
        return { status: false, message: "Error al unirse a la partida" };
    }
}
async function leaveMatchBD(matchDetails) {
    try {
        let result = await matchModel.updateOne(
            { _id: matchDetails._id },
            { contrincante_partida: "" }
        );
        if (result) {
            return { status: true, message: "Se ha salido de la partida" };
        } else {
            return { status: false, message: "No se ha salido de la partida" };
        }
    } catch(err) {
        return { status: false, message: "Error al salir de la partida" };
    }
}

// Funciona en el back y en el front
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
        return { status: false, message: "No se han podido sacar las partidas" };
    }
}

async function updateMatchBD(matchDetails) {
    try {
console.log("esto eto", matchDetails.params);
console.log("eeeee eto", matchDetails.body);
        let result = await matchModel.updateOne(
            { _id: matchDetails.params._id },
            {
                fecha_partida: matchDetails.body.fecha_partida,
                puntuacion_maxima_partida: matchDetails.body. puntMax,
                puntuacion_minima_partida: matchDetails.body.puntMin
            }
        )
        console.log(result)
        if (result) {
            return { status: true, msg: "Partida actualizada con éxito" };
        } else {
            return { status: false, msg: "No se pudo actualizar la partida" };
        }
    } catch(err) {
        return { status: false, msg: "Error al actualizar la partida" };
    }
}





// Funciona en el back y en el front
const getMyMatchesBD = async (correo) => {
    try {
        const matches = await matchModel.find({ $or: [{ creador_partida: correo }, { contrincante_partida: correo }] });
        return { status: true, matches: matches };
    } catch (error) {
        console.error('Error al obtener las partidas del usuario:', error);
        return { status: false, message: 'Error al obtener las partidas del usuario' };
    }
};

module.exports = { createMatchBD, deleteMatchBD, joinMatchBD, leaveMatchBD, getAllMatchesBD, updateMatchBD, getMyMatchesBD };
