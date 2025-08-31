import {Document, Model, model, Query, Schema, Types} from 'mongoose';
import {withHelpers} from '../config/helpers/mongooseHelpers';

/**
 * Possible statuses for a Course.
 */
enum CourseStatusEnum {
  Active = 'active',
  Closed = 'closed',
}

/**
 * Course Interface
 */
interface ICourse extends Document {
  name: string;
  description: string;
  currentStatus: CourseStatusEnum; // Use enum here
  subject: Types.ObjectId;
  removeDate: Date | null;
}

/**
 * Course Schema
 */
const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  currentStatus: {
    type: String,
    required: true,
    enum: Object.values(CourseStatusEnum), // restrict to enum values
    default: CourseStatusEnum.Active,
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  removeDate: {
    type: Date,
    default: null,
  },
});

// Pre hook to only return courses whose remove date is null on find operations
courseSchema.pre<Query<ISubject[], ISubject>>(/^find/, function (next) {
  this.where({removeDate: null});
  next();
});

/**
 * Subject Interface and Schema
 */
interface ISubject extends Document {
  name: string;
  description: string;
  removeDate: Date | null;
}

const subjectSchema = new Schema<ISubject>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  removeDate: {
    type: Date,
    default: null,
  },
});

// Pre hook to only return subjects whose remove date is null on find operations
subjectSchema.pre<Query<ISubject[], ISubject>>(/^find/, function (next) {
  this.where({removeDate: null});
  next();
});

const CourseModel: Model<ICourse> = model<ICourse>('Course', courseSchema);
const SubjectModel: Model<ISubject> = model<ISubject>('Subject', subjectSchema);

const Course = withHelpers<ICourse, typeof CourseModel>(CourseModel);
const Subject = withHelpers<ISubject, typeof SubjectModel>(SubjectModel);

export {ISubject, ICourse, CourseStatusEnum, Subject, Course};
