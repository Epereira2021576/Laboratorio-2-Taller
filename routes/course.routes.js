const { Router } = require('express');
const { check } = require('express-validator');
const {
  validarCampos,
  checkTeacherRole,
} = require('../middlewares/validar-campos');

const {
  courseNameExists,
  courseExistsById,
} = require('../helpers/db-validators');

const {
  coursePost,
  courseGet,
  coursePut,
  courseDelete,
} = require('../controllers/courses.controller');

const router = Router();

router.get('/', courseGet);

router.post(
  '/',
  [
    check('courseName', 'The name is required').not().isEmpty(),
    check('courseName').custom(courseNameExists),
    check('courseType', 'Invalid Course Type').not().isEmpty(),
    check('courseTeacher', 'Teacher email is required').isEmail(),
    validarCampos,
  ],
  coursePost
);

router.put(
  '/put/:id',
  [
    check('id', 'Invalid Id').isMongoId(),
    check('id').custom(courseExistsById),
    checkTeacherRole,
    validarCampos,
  ],
  coursePut
);

router.delete(
  '/delete/:id',
  [
    check('id', 'Invalid Id').isMongoId(),
    check('id').custom(courseExistsById),
    checkTeacherRole,
  ],
  courseDelete
);
module.exports = router;
