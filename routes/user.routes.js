const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const {
  emailExists,
  userExistsById,
  courseNameExists,
  courseExistsById,
} = require('../helpers/db-validators');
const {
  userPost,
  userGet,
  userPut,
  userDelete,
  userLogin,
} = require('../controllers/user.controller');

const router = Router();

router.post(
  '/login',
  [
    check('email', 'This is not a valid email').isEmail(),
    check(
      'password',
      'The password must be greater than 6 characters'
    ).isLength({
      min: 6,
    }),
    validarCampos,
  ],
  userLogin
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

router.delete(
  '/delete/:id',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(userExistsById),
    validarCampos,
  ],
  userDelete
);

router.put(
  '/put/:id',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(userExistsById),
    validarCampos,
  ],
  userPut
);

router.post(
  '/',
  [
    check('name', 'The name is required').not().isEmpty(),
    check('email', 'The email is required').isEmail(),
    check('email').custom(emailExists),
    check(
      'password',
      'The password must be greater than 6 characters'
    ).isLength({
      min: 6,
    }),
    validarCampos,
  ],
  userPost
);

module.exports = router;
