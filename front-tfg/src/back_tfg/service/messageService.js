var messageModel = require("../models/message")
var userModel = require("../models/user");
var jwt = require('./jwt');

const mongoose = require('mongoose');


var moment = require('moment');

async function saveMessageBD(messageDetails) {
    if (!messageDetails.texto_mensaje || !messageDetails.receiver) {
        return { status: false, message: 'Envia los datos necesarios' };
    }
    try {
        var messageModelData = new messageModel();
        messageModelData.emitter = messageDetails.emitter;
        messageModelData.receiver = messageDetails.receiver;
        messageModelData.texto_mensaje = messageDetails.texto_mensaje;
        messageModelData.fecha_creacion_mensaje = moment().unix().toString();
        messageModelData.viewed = 'false';

        let result = await messageModelData.save();
        console.log(result);
        if (result) {
            return { status: true, message: "mensaje creado" };
        } else {
            return { status: false, message: "error al enviar el mensaje" };
        }
    } catch (err) {
        console.error(err);
        return { status: false, message: 'Error al guardar el mensaje en la base de datos' };
    }
};

async function getReceivedMessagesBD(messageDetails) {
    try {
        let result = await messageModel.find({ receiver: new mongoose.Types.ObjectId(messageDetails) }).populate('emitter', 'nickname_usuario');
        console.log(result);
        if (result) {
            return { status: true, messages: result };
        } else {
            return { status: false, message: "Error al sacar los mensajes" };
        }
    } catch (err) {
        console.error(err);
        return { status: false, message: 'Error retrieving messages from the database' };
    }
}

async function getEmmitMessagesBD(messageDetails) {
    try {
        let result = await messageModel.find({ emitter: new mongoose.Types.ObjectId(messageDetails) }).populate('emitter', 'nickname_usuario');
        console.log(result);
        if (result) {
            return { status: true, messages: result };
        } else {
            return { status: false, message: "Error al sacar los mensajes" };
        }
    } catch (err) {
        console.error(err);
        return { status: false, message: 'Error retrieving messages from the database' };
    }
};

async function getUnviewedMessagesBD(messageDetails) {

    try {
        const unviewedMessagesCount = await messageModel.countDocuments({
            receiver: new mongoose.Types.ObjectId(messageDetails),
            viewed: 'false'
        });
        return { status: true, count: unviewedMessagesCount };
    } catch (err) {
        console.error(err);
        return { status: false, message: 'Error retrieving unviewed messages count' };
    }
};

async function markMessagesAsViewedBD(messageDetails) {
    try {
        const result = await messageModel.updateMany(
            { receiver: new mongoose.Types.ObjectId(messageDetails), viewed: 'false' },
            { $set: { viewed: 'true' } }
        );
        return { status: true, updatedCount: result.modifiedCount };
    } catch (err) {
        console.error(err);
        return { status: false, message: 'Error updating messages to viewed' };
    }
}





module.exports = {saveMessageBD, getReceivedMessagesBD,getEmmitMessagesBD, getUnviewedMessagesBD,markMessagesAsViewedBD}