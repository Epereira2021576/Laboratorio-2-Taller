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
  userGetById,
  userLogin,
} = require('../controllers/user.controller');
const {
  verifyStudentRole,
  studentNotInCourse,
  studentInCourse,
  teacherOrSameUser,
  courseIsTeacher,
  courseHasThree,
} = require('../middlewares/middleAuth');

const router = Router();

router.post(
  '/register',
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

router.post(
  '/login',
  [
    check('email', 'This is not a valid email').isEmail(),
    check('password', 'The password must be greater than 6 characters')
      .isLength({
        min: 6,
      })
      .withMessage('The password must be greater than 6 characters'),
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

router.put(
  '/:id/course/:courseId',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(userExistsById),
    check('courseId', 'Invalid course id').isMongoId(),
    check('courseId').custom(courseExistsById),
    teacherOrSameUser,
    courseHasThree,
    studentNotInCourse,
    validarCampos,
  ],
  async (req, res) => {
    const { id, courseId } = req.params;
    const { course } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { course: [...course, courseId] },
      { new: true }
    );
    res.status(200).json({
      message: 'User course updated successfully',
      user,
    });
  }
);

router.delete(
  '/:id/course/:courseId',
  [
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(userExistsById),
    check('courseId', 'Invalid course id').isMongoId(),
    check('courseId').custom(courseExistsById),
    teacherOrSameUser,
    studentInCourse,
    validarCampos,
  ],
  async (req, res) => {
    const { id, courseId } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { course: courseId } },
      { new: true }
    );
    res.status(200).json({
      message: 'User course deleted successfully',
      user,
    });
  }
);

module.exports = router;
