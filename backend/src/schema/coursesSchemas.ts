import {z} from 'zod';
import {CourseStatusEnum} from '../models/courseModels';
import {getObjectIdSchema} from '../utils/schema';

const courseStatus = Object.values(CourseStatusEnum) as [string, ...string[]];

export const getCourseByIdSchema = z.object({
  id: getObjectIdSchema({required_error: 'id is required'}),
});

export const createCourseSchema = z.object({
  name: z
    .string({required_error: 'Course name is required'})
    .min(1, {message: 'Course name cannot be empty'}),
  description: z.string().optional(),
  subject: getObjectIdSchema({required_error: 'Subject is required'}),
  status: z
    .enum(courseStatus, {
      errorMap: () => ({message: 'Invalid course status'}),
    })
    .optional(),
});

export const updateCourseSchema = z.object({
  id: getObjectIdSchema({required_error: 'id is required'}),
  name: z
    .string({required_error: 'Course name is required'})
    .min(1, {message: 'Course name cannot be empty'}),
  description: z.string().optional(),
  subject: getObjectIdSchema({required_error: 'Subject is required'}),
  status: z
    .enum(courseStatus, {
      errorMap: () => ({message: 'Invalid course status'}),
    })
    .optional(),
});

export const deleteCourseSchema = z.object({
  id: getObjectIdSchema({required_error: 'id is required'}),
});


//************************* */
// Subject schemas
//************************* */

export const getSubjectByIdSchema = z.object({
  id: getObjectIdSchema({required_error: 'id is required'}),
});

export const createSubjectSchema = z.object({
  name: z
    .string({required_error: 'Subject name is required'})
    .min(1, {message: 'Subject name cannot be empty'}),
  description: z.string().optional(),
});

export const updateSubjectSchema = z.object({
  id: getObjectIdSchema({required_error: 'id is required'}),
  name: z
    .string({required_error: 'Subject name is required'})
    .min(1, {message: 'Subject name cannot be empty'}),
  description: z.string().optional(),
});

export const deleteSubjectSchema = z.object({
  id: getObjectIdSchema({required_error: 'id is required'}),
});
