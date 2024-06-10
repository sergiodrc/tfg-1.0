'use strict';

var moment = require('moment');

var messageService = require("../service/messageService");
var message = require('../models/message');
let user = require('../models/user');

async function saveMessage(req, res) {
    var result = null;
    console.log(req.body);
    result = await messageService.saveMessageBD(req.body);
    console.log(result);
    if (result.status) {
        return res.json({ status: true, message: "Mensaje enviado" });
    } else {
        return res.json({ status: false, message: result.message });
    }
}

async function getMessages(req, res) {
    const { receiver } = req.params; // Obtenemos el receiver desde los parámetros de la URL
    if (!receiver) {
        return res.json({ status: false, message: 'Receiver email is required' });
    }
    try {
        const result = await messageService.getReceivedMessagesBD(receiver);
        if (result.status) {
            return res.json({ status: true, messages: result.messages });
        } else {
            return res.json({ status: false, message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.json({ status: false, message: 'Error retrieving messages' });
    }
}

async function getMySentMessages(req, res) {
    var { email } = req.params;
    console.log('-> ',email)
    if (!email) {
        return res.send({ status: false, message: 'Correo del emisor es requerido' });
    }
    try {
        var result = await messageService.getEmmitMessagesBD(email);
        if (result.status) {
            return res.send({ status: true, messages: result.messages });
        } else {
            return res.send({ status: false, message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.send({ status: false, message: 'Error al recuperar los mensajes' });
    }
}

async function getUnviewedMessages(req, res) {
    var { receiver } = req.body;
    if (!receiver) {
        return res.json({ status: false, message: 'Receiver ID is required' });
    }
    try {
        var result = await messageService.getUnviewedMessagesBD(receiver);
        if (result.status) {
            return res.json({ status: true, unviewed: result.count });
        } else {
            return res.json({ status: false, message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.json({ status: false, message: 'Error processing request' });
    }
}

async function updateMessagesToViewed(req, res) {
    var { receiver } = req.body;
    if (!receiver) {
        return res.json({ status: false, message: 'Receiver ID is required' });
    }
    try {
        var result = await messageService.markMessagesAsViewedBD(receiver);
        if (result.status) {
            return res.status(200).json({ status: true, updatedCount: result.updatedCount });
        } else {
            return res.status(500).json({ status: false, message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: 'Error processing request' });
    }
}


module.exports = { saveMessage, getMessages, getMySentMessages, getUnviewedMessages, updateMessagesToViewed };