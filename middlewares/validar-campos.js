const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json(error);
  }

  next();
};

const checkTeacherRole = async (req, res, next) => {
  const { idCheck } = req.body;

  try {
    const userFind = await User.findById(idCheck);
    if (!userFind) {
      return res.status(400).json({
        msg: 'Inexistent Id',
      });
    }

    if (userFind.role === 'TEACHER_ROLE') {
      req.body.role = 'TEACHER_ROLE';
      next();
    } else {
      return res.status(400).json({
        msg: 'Only teachers can modify or delete courses',
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: 'Unexpected Error',
    });
  }
};

module.exports = {
  validarCampos,
  checkTeacherRole,
};
