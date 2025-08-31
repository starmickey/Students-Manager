import {Request, Response} from 'express';
import {
  createCourseSchema,
  createSubjectSchema,
  deleteSubjectSchema,
  getCourseByIdSchema,
  getSubjectByIdSchema,
  updateSubjectSchema,
} from '../schema/coursesSchemas';
import {
  createCourse,
  createSubject,
  deleteCourse,
  deleteSubject,
  getCourseByIdOrFail,
  getCoursesPage,
  getSubjectByIdOrFail,
  getSubjectsPage,
  updateCourse,
  updateSubject,
} from '../repository/courseRepository';
import {paginationSchema} from '../schema/commonSchemas';

export async function getCoursesPageController(req: Request, res: Response) {
  const paginationProps = paginationSchema.parse(req.query);
  const result = await getCoursesPage(paginationProps);
  res.status(200).send(result);
}

export async function getCourseByIdController(req: Request, res: Response) {
  const { id } = getCourseByIdSchema.parse(req.params);
  const course = await getCourseByIdOrFail(id);
  res.status(200).send(course);
}

export async function createCourseController(req: Request, res: Response) {
  const data = createCourseSchema.parse(req.body);
  const course = await createCourse(data);
  res.status(201).send(course);
}

export async function updateCourseController(req: Request, res: Response) {
  const {id, ...data} = updateSubjectSchema.parse(req.body);
  const course = await updateCourse(id, data);
  res.status(200).send(course);
}

export async function deleteCourseController(req: Request, res: Response) {
  const {id} = deleteSubjectSchema.parse(req.body);
  const course = await deleteCourse(id);
  res.status(200).send(course);
}

export async function getSubjectsController(req: Request, res: Response) {
  const paginationProps = paginationSchema.parse(req.query);
  const result = await getSubjectsPage(paginationProps);
  res.status(200).send(result);
}

export async function getSubjectByIdController(req: Request, res: Response) {
  const { id } = getSubjectByIdSchema.parse(req.params);
  const subject = await getSubjectByIdOrFail(id);
  res.status(200).send(subject);
}

export async function createSubjectController(req: Request, res: Response) {
  const data = createSubjectSchema.parse(req.body);
  const subject = await createSubject(data);
  res.status(201).send(subject);
}

export async function updateSubjectController(req: Request, res: Response) {
  const {id, ...data} = updateSubjectSchema.parse(req.body);
  const subject = await updateSubject(id, data);
  res.status(200).send(subject);
}

export async function deleteSubjectController(req: Request, res: Response) {
  const {id} = deleteSubjectSchema.parse(req.body);
  const subject = await deleteSubject(id);
  res.status(200).send(subject);
}
