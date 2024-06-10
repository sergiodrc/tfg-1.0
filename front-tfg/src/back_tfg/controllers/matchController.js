var moment = require('moment');

var matchService = require("../service/matchService")
//funciona  back y front
async function createMatch(req, res) {
    var result = null;
    console.log('Body -> ',req.body)
    result = await matchService.createMatchBD(req.body)
    console.log('result -> ',result)

    if (result.status === true) {
        return res.send({ status: true, message: "partida creada" });
    } else {
        return res.send({ status: false, message: 'fallo en el controller' });
    }
}
//funciona  back y front
async function deleteMatch(req, res) {
    try {
        const { id, correo } = req.body; // Obtener el id y el correo del cuerpo de la petición
        if (!id || !correo) {
            return res.status(400).send({ status: false, message: "Match ID y correo son requeridos" });
        }

        const result = await matchService.deleteMatchBD({ _id: id, correo: correo });
        if (result.status) {
            res.status(200).send({ status: true, message: "Partida Borrada" });
        } else {
            res.status(404).send({ status: false, message: result.msg });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: false, message: "Error al borrar la partida" });
    }
}



async function joinMatch(req, res) {
    try {
        var result = null;
        result = await matchService.joinMatchBD(req.body)
        if (result.status === true) {
            res.send({ status: true, message: "Se ha unido a la partida!" });
        } else {
            res.send({ status: true, message: "No Se ha unido a la partida!" });
        }
    } catch(err) {
        res.send({ status: true, message: "Error al unirse a la partida!" });
    }
}


async function leaveMatch(req, res) {
    try {
        var result = null;
        result = await matchService.leaveMatchBD(req.body)
        if (result.status === true) {
            res.send({ status: true, message: "Se ha abandonado a la partida!" });
        } else {
            res.send({ status: true, message: "No Se ha abandonado a la partida!" });
        }
    } catch(err) {
        res.send({ status: true, message: "Error al abandonar a la partida!" });
    }
}
//funciona  back y front
async function getAllMatches(req, res) {
    try {
        const result = await matchService.getAllMatchesBD();
        if (result.status === true) {
            res.send({ status: true, message: result.message, matches: result.matches });
        } else {
            res.send({ status: false, message: result.message });
        }
    } catch(err) {
        console.error(err);
        res.send({ status: false, message: "Error al sacar todas las partidas!" });
    }
}

async function updateMatch(req, res) {
    try {
        console.log(req.body)
        var result = null;
        result = await matchService.updateMatchBD(req)
        console.log(result)
        if (result.status === true) {
            res.send({ status: true, message: "Partida actualizada" });
        } else {
            res.send({ status: false, message: "No se pudo actualizar la partida" });
        }
    } catch (error) {
        console.log(error)
        res.send({ status: false, message: "Algo ha fallado!" });
    }
}


async function getMyMatches(req, res) {
    try {
        const correo = req.query.correo; // Obtener el correo del query en lugar del cuerpo de la solicitud

        if (!correo) {
            return res.status(400).send({ status: false, message: "Correo no encontrado en la solicitud" });
        }

        const result = await matchService.getMyMatchesBD(correo); // Pasar el correo a la función del servicio

        if (result.status === true) {
            res.send({ status: true, message: "Partidas obtenidas correctamente", matches: result.matches });
        } else {
            res.send({ status: false, message: "Error al obtener tus partidas" });
        }
    } catch(err) {
        console.error(err);
        res.send({ status: false, message: "Error al obtener tus partidas" });
    }
}
module.exports = {createMatch, deleteMatch, joinMatch, leaveMatch, getAllMatches, updateMatch, getMyMatches}
