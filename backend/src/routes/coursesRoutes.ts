import {Router} from 'express';
import {useExceptionsMiddleware} from '../middleware/exceptions';
import {
  createCourseController,
  createSubjectController,
  deleteCourseController,
  deleteSubjectController,
  getCourseByIdController,
  getCoursesPageController,
  getSubjectByIdController,
  getSubjectsController,
  updateCourseController,
  updateSubjectController,
} from '../controllers/coursesController';

export function getCoursesRoutes(): Router {
  const router = Router();

  router.get('', useExceptionsMiddleware(getCoursesPageController));
  router.get('/:id', useExceptionsMiddleware(getCourseByIdController));
  router.post('/create', useExceptionsMiddleware(createCourseController));
  router.put('/update', useExceptionsMiddleware(updateCourseController));
  router.delete('/delete', useExceptionsMiddleware(deleteCourseController));

  return router;
}

export function getSubjectRoutes(): Router {
  const router = Router();

  router.get('', useExceptionsMiddleware(getSubjectsController));
  router.get('/:id', useExceptionsMiddleware(getSubjectByIdController));
  router.post('/create', useExceptionsMiddleware(createSubjectController));
  router.put('/update', useExceptionsMiddleware(updateSubjectController));
  router.delete('/delete', useExceptionsMiddleware(deleteSubjectController));

  return router;
}
