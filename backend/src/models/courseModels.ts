import {Document, Model, model, Schema, Types} from 'mongoose';
/**
 * Course models keep the student or teacher role and progress in each course
 */

// Course status

interface ICourseStatus extends Document {
  name: String;
  description: string;
  removeDate?: Date;
}

const courseStatusSchema = new Schema<ICourseStatus>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  removeDate: Date,
});

const CourseStatus: Model<ICourseStatus> = model<ICourseStatus>(
  'CourseStatus',
  courseStatusSchema,
);

// Course status history

interface ICourseStatusHistoryEntry extends Document {
  status: Types.ObjectId;
  date: Date;
}
const courseStatusHistoryEntrySchema = new Schema<ICourseStatusHistoryEntry>({
  status: {
    type: Schema.Types.ObjectId,
    ref: 'CourseStatus',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const CourseStatusHistoryEntry: Model<ICourseStatusHistoryEntry> =
  model<ICourseStatusHistoryEntry>(
    'CourseStatusHistoryEntry',
    courseStatusHistoryEntrySchema,
  );

// Establishment

interface IEstablishment extends Document {
  name: String;
  description: String;
  removeDate?: Date;
}
const establishmentSchema = new Schema<IEstablishment>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  removeDate: Date,
});

const Establishment: Model<IEstablishment> = model<IEstablishment>(
  'Establishment',
  establishmentSchema,
);

// Course

interface ICourse extends Document {
  name: string;
  description: string;
  currentStatus?: Types.ObjectId;
  statusHistory?: Types.ObjectId[];
  establishment?: Types.ObjectId;
}

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
    type: Schema.Types.ObjectId,
    ref: 'CourseStatus',
    required: true,
  },
  statusHistory: {
    type: [courseStatusHistoryEntrySchema],
    default: [],
  },
});

const Course: Model<ICourse> = model<ICourse>('Course', courseSchema);

export {
  ICourseStatus,
  ICourseStatusHistoryEntry,
  IEstablishment,
  ICourse,
  CourseStatus,
  CourseStatusHistoryEntry,
  Establishment,
  Course,
};
