const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const {
  courseNameExists,
  emailDoesntExists,
} = require('../helpers/db-validators');

const {
  userInfoDelete,
  userInfoGet,
  userInfoPost,
  userInfoPut,
} = require('../controllers/userInfo.controller');

const router = Router();

router.get('/', userInfoGet);

router.post(
  '/',
  [
    check('userName', 'The name is required').not().isEmpty(),
    check('userEmail', 'Invalid email').isEmail(),
    validarCampos,
  ],
  userInfoPost
);

router.delete(
  '/delete/:id',
  [
    check('id', 'Invalid Id').isMongoId(),
    check('id').custom(emailDoesntExists),
    validarCampos,
  ],
  userInfoDelete
);

router.get(
  '/search',
  [check('userEmail').custom(emailDoesntExists), validarCampos],
  userInfoPut
);

module.exports = router;
