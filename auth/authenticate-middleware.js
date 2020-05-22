/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const token = req.headers.authorization;

	if (token) {
		const secret = process.env.JWT_SECRET || 'thisisthesecretkey';

		jwt.verify(token, secret, (error, decodedToken) => {
			if (error) {
				res.status(401).json({ you: 'shall not pass!' });
			} else {
				req.jwt = decodedToken;
				next();
			}
		});
	} else {
		res.status(400).json({ message: 'Please provide the correct Info' });
	}
};
