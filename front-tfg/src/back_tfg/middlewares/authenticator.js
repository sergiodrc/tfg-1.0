const jwt = require('jsonwebtoken');
const moment = require('moment');
const secret = 'root';

async function ensureAuth(req, res) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).send({ message: 'Requiere token' });
  }

  // Remove double and single quotes from the token
  const token = authorization.replace(/[\"\']+/g, '');

  try {
    const payload = jwt.decode(token);
    
    decodedToken = payload;
    return decodedToken
  } catch (error) {
    return ({status: false, message: error });
  }
};


module.exports = {ensureAuth}