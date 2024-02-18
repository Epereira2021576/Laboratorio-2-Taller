const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { emailExists, userExistsById } = require('../helpers/db-validators');

const {
  userPost,
  userGet,
  userPut,
  userDelete,
  userGetById,
} = require('../controllers/user.controller');

const router = Router();

router.post(
  '/',
  [
    check('name', 'The name is required').not().isEmpty(),
    check(
      'password',
      'The password must be greater than 6 characters'
    ).isLength({
      min: 6,
    }),
    check('email', 'This is not a valid email').isEmail(),
    check('email').custom(emailExists),
    check('role'),
    check('course', 'The course is required').not().isEmpty(),
    validarCampos,
  ],
  userPost
);

router.get('/', userGet);

router.get(
  '/:id',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(userExistsById),
    validarCampos,
  ],
  userGet
);

router.put(
  '/:id',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(userExistsById),
    validarCampos,
  ],
  userPut
);

module.exports = router;
