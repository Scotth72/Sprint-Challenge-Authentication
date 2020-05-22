const bcryptjs = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model');
const { isValid } = require('../users/user-services');

router.post('/register', (req, res) => {
	// implement registration
	const credententials = req.body;
	if (isValid(credentials)) {
		const rounds = process.env.BCRYPT_ROUNDS || 8;
		const hash = bcryptjs.hashSync(credentials.password, 10);
		credentials.password = hash;

		Users.insert(credentials)
			.then((user) => {
				res.status(201).json({ data: user });
			})
			.catch((error) => {
				res.status(500).json({ message: error.message });
			});
	} else {
		res.status(400).json({
			message: 'Please provide username and password'
		});
	}
});

router.post('/login', (req, res) => {
	// implement login
	const { username, password } = req.body;
	if (isValid(req.body)) {
		Users.getBy({ username: username })
			.then(([ user ]) => {
				if (user && bcryptjs.compareSync(password, user.password)) {
					const token = createToken(user);
					res.status(200).json({ message: 'Welcome to our API', token });
				} else {
					res.status(401).json({ message: 'Invalid credentials' });
				}
			})
			.catch((err) => {
				res.status(500).json({ message: err.message });
			});
	} else {
		res.status(400).json({ message: 'Please provide username and password' });
	}
});

function createToken(user) {
	const payload = {
		sub: user.id,
		username: user.username,
		role: user.role
	};
	const options = {
		expiresIn: '1d'
	};
	return jwt.sign(payload, process.env.JWT_SECRET || 'thisisthesecretkey', options);
}

module.exports = router;
