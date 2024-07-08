const jwt = require('jsonwebtoken');
const User = require('../models/user')

module.exports = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
      const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
  
      if (!user) {
        throw new Error();
      }
  
      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: 'Please authenticate.' });
    }
};
