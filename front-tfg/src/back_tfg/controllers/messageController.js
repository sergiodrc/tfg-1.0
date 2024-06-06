'use strict'

var moment = require('moment');

var messageService = require("../service/messageService")
var message = require('../models/message');
let user = require('../models/user')

async function saveMessage(req, res) {
    var result = null;
    console.log(req.body);
    result = await messageService.saveMessageBD(req.body);
    console.log(result);
    if (result.status) {
        return res.send({ status: true, message: "Mensaje enviado" });
    } else {
        return res.send({ status: false, message: result.message });
    }
}

async function getMessages(req, res) {
    const { receiver } = req.body;
    if (!receiver) {
        return res.send({ status: false, message: 'Receiver ID is required' });
    }
    try {
        const result = await messageService.getReceivedMessagesBD(receiver);
        if (result.status) {
            return res.send({ status: true, messages: result.messages });
        } else {
            return res.send({ status: false, message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.send({ status: false, message: 'Error retrieving messages' });
    }
}

async function getEmmitMessages(req, res) {
    const { emitter } = req.body;
    if (!emitter) {
        return res.send({ status: false, message: 'emmiter ID is required' });
    }
    try {
        const result = await messageService.getEmmitMessagesBD(emitter);
        if (result.status) {
            return res.send({ status: true, messages: result.messages });
        } else {
            return res.send({ status: false, message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.send({ status: false, message: 'Error retrieving messages' });
    }
}

async function getUnviewedMessages(req,res) {
    const { receiver } = req.body;
    if (!receiver) {
        return res.send({ status: false, message: 'Receiver ID is required' });
    }
    try {
        const result = await messageService.getUnviewedMessagesBD(receiver);
        if (result.status) {
            return res.send({ status: true, unviewed: result.count });
        } else {
            return res.send({ status: false, message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.send({ status: false, message: 'Error processing request' });
    }
}

async function updateMessagesToViewed(req, res) {
    const { receiver } = req.body;
    if (!receiver) {
        return res.send({ status: false, message: 'Receiver ID is required' });
    }
    try {
        const result = await messageService.markMessagesAsViewedBD(receiver);
        if (result.status) {
            return res.status(200).send({ status: true, updatedCount: result.updatedCount });
        } else {
            return res.status(500).send({ status: false, message: result.message });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, message: 'Error processing request' });
    }
}
module.exports = {saveMessage, getMessages, getEmmitMessages, getUnviewedMessages,updateMessagesToViewed}
