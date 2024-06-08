var moment = require('moment');

var matchService = require("../service/matchService")

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
async function deleteMatch(req, res) {
    try {
        const { id } = req.params; // Obtener el id de los parámetros de la URL
        if (!id) {
            return res.send({ status: false, message: "Match ID is required" });
        }

        const result = await matchService.deleteMatchBD({ _id: id });
        if (result.status) {
            res.send({ status: true, message: "Partida Borrada" });
        } else {
            res.send({ status: false, message: result.msg });
        }
    } catch (error) {
        console.error(error);
        res.send({ status: false, message: "Error al borrar la partida" });
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
        var result = null;
        result = await matchService.updateMatchBD(req.body)
        if (result.status === true) {
            res.send({ status: true, message: "Partida actualizada" });
        } else {
            res.send({ status: true, message: "No se pudo actualizar la partida" });
        }
    } catch (error) {
        res.send({ status: true, message: "Algo ha fallado!" });
    }
}

async function getMyMatches(req, res) {
    try {
    var result = null;
    result = await matchService.getMyMatchesBD(req.body)
    if (result.status === true) {
        res.send({ status: true, message: "Sacando tus partidas..." });
    } else {
        res.send({ status: true, message: "Algo ha fallado!" });
    }
    } catch(err) {
        res.send({ status: true, message: "Error al sacar todas tus partidas!" });
}
}

module.exports = {createMatch, deleteMatch, joinMatch, leaveMatch, getAllMatches, updateMatch, getMyMatches}
