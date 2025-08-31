import {Types} from 'mongoose';
import {Course, ICourse, Subject, ISubject} from '../models/courseModels';
import {FetchPageQueryProps} from '../config/helpers/mongooseHelpers';

/**
 * COURSE REPOSITORY
 */
export const createCourse = (data: Partial<ICourse>): Promise<ICourse> =>
  Course.create(data);

export const getCourseByIdOrFail = (
  id: string | Types.ObjectId,
): Promise<ICourse | null> =>
  Course.findByIdOrFail(id).populate('subject').exec();

export const getCoursesPage = async (props: FetchPageQueryProps) => {
  const query = Course.fetchPage(props);
  const data = await query.populate('subject').exec();
  return {...query.meta, data};
};

export const updateCourse = (
  id: string | Types.ObjectId,
  data: Partial<ICourse>,
): Promise<ICourse | null> =>
  Course.findByIdAndUpdateOrFail(id, data, {new: true}).exec();

export const deleteCourse = (
  id: string | Types.ObjectId,
): Promise<ICourse | null> => Course.findByIdAndDelete(id).exec();

export const findCourseBySubject = (
  subjectId: string | Types.ObjectId,
): Promise<ICourse[]> =>
  Course.find({subject: subjectId}).populate('currentStatus').exec();

/**
 * SUBJECT REPOSITORY
 */
export const createSubject = (data: Partial<ISubject>): Promise<ISubject> =>
  Subject.create(data);

export const getSubjectByIdOrFail = (
  id: string | Types.ObjectId,
): Promise<ISubject | null> => Subject.findByIdOrFail(id);

export const getSubjectsPage = async (props: FetchPageQueryProps) => {
  const query = Subject.fetchPage(props);
  const data = await query.exec();
  return {...query.meta, data};
};

export const updateSubject = (
  id: string | Types.ObjectId,
  data: Partial<ISubject>,
): Promise<ISubject | null> => Subject.findByIdAndUpdateOrFail(id, data);

export const deleteSubject = (
  id: string | Types.ObjectId,
): Promise<ISubject | null> =>
  Subject.findByIdAndUpdateOrFail(id, {removeDate: new Date()});
