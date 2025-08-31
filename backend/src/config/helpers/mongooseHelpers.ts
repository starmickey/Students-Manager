import { Document, Model, Types, Query, SortOrder } from "mongoose";
import { BadRequest, NotFound } from "../exceptions";

export interface FetchPageQueryProps {
  page?: number;
  pageSize?: number;
  sort?: string | { [key: string]: SortOrder } | [string, SortOrder][] | null;
  filter?: Record<string, any>;
}

export function withHelpers<T extends Document, M extends Model<T>>(model: M) {
  return Object.assign(model, {
    findByIdOrFail(id: string | Types.ObjectId): Query<T, T> {
      const query: Query<T | null, T> = model.findById(id);
      const originalExec = query.exec.bind(query);

      // Override exec to throw NotFound if result is null
      query.exec = async function (): Promise<T> {
        const doc = await originalExec();
        if (!doc) throw new NotFound(`${model.modelName} not found`);
        return doc;
      } as any;

      return query as Query<T, T>;
    },

    findByIdAndUpdateOrFail(
      id: string | Types.ObjectId,
      update: Partial<T>,
      options: { new?: boolean } = { new: true }
    ): Query<T, T> {
      const query: Query<T | null, T> = model.findByIdAndUpdate(id, update, {
        ...options,
        runValidators: true,
      });

      const originalExec = query.exec.bind(query);

      query.exec = async function (): Promise<T> {
        const doc = await originalExec();
        if (!doc) throw new NotFound(`${model.modelName} not found`);
        return doc;
      } as any;

      return query as Query<T, T>;
    },

    fetchPage(props: FetchPageQueryProps = {}): Query<T[], T> & { meta: { page: number; pageSize: number; total: number; totalPages: number } } {
      const { page = 1, pageSize = 10, sort, filter = {} } = props;

      if (page <= 0 || pageSize <= 0) {
        throw new BadRequest("Page and pageSize must be positive integers");
      }

      const totalPromise = model.countDocuments(filter);

      const skip = (page - 1) * pageSize;
      let query = model.find(filter).skip(skip).limit(pageSize);
      if (sort) query = query.sort(sort as any);

      // Attach meta info to the query object
      const meta: { page: number; pageSize: number; total: number; totalPages: number } = {
        page,
        pageSize,
        total: 0,
        totalPages: 1,
      };

      // Wrap .exec to fill meta before returning
      const originalExec = query.exec.bind(query);
      query.exec = async function () {
        const [data, total] = await Promise.all([originalExec(), totalPromise]);
        meta.total = total;
        meta.totalPages = Math.max(1, Math.ceil(total / pageSize));
        return data;
      } as any;

      // Attach meta to query for access before/after execution
      (query as any).meta = meta;

      return query as any;
    },

  }) as M & {
    findByIdOrFail(id: string | Types.ObjectId): Query<T, T>;
    findByIdAndUpdateOrFail(
      id: string | Types.ObjectId,
      update: Partial<T>,
      options?: { new?: boolean }
    ): Query<T, T>;
    fetchPage(props?: FetchPageQueryProps): Query<T[], T> & { meta: { page: number; pageSize: number; total: number; totalPages: number } };
  };
}
