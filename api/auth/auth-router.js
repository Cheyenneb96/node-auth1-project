
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const {
  checkUsernameFree,
  checkPasswordLength,
  checkUsernameExists,
  passwordCheck,
} = require('../auth/auth-middleware')


router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 9)
    const newUser = { username, password: hash }
    const user = await User.add(newUser)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

router.post('/login', checkUsernameExists, checkPasswordLength, passwordCheck, (req, res, next) => {
  try {
    req.session.user = req.body
    res.json({ message: `welcome ${req.body.username}` })
  } catch (error) {
    next(error)
  }
})


router.get('/logout', async (req, res, next) => {
  if (!req.session.user) {
    return res.json({
      status: 200,
      message: 'no session'
    })
  }

  req.session.destroy((error) => {
    if (error) {
      return res.json({
        message: `Can't log you out`
      })
    }
    res.json({
      status: 200,
      message: 'logged out'
    })
  })
})


module.exports = router
