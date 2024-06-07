const message = require('../models/message')
let publicationService = require('../service/publicationService')

async function createPublication(req,res) {
    console.log('req body -> ',req.body)
    var result = await publicationService.createPublicationBD(req.body)
    console.log('Result -> ', result)
    if(result.status === true) {
        res.send({status: true, message: "publication created"})
    } else {
        res.send({status:false, message: "Error creating the publication"})
    }
}

module.exports = { createPublication }

