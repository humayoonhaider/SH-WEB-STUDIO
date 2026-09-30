import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getIsMongooseConnected } from '../config/db.js';
import {
  AdminModel,
  SiteSettingsModel,
  ServiceModel,
  ProjectModel,
  TeamMemberModel,
  ProcessStepModel,
  ContactInquiryModel,
  SEOSettingsModel,
  TestimonialModel,
  PricingPlanModel,
  IAdmin,
  ISiteSettings,
  IService,
  IProject,
  ITeamMember,
  IProcessStep,
  IContactInquiry,
  ISEOSettings,
  ITestimonial,
  IPricingPlan,
} from './schemas.js';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

interface LocalDBData {
  admins: any[];
  siteSettings: any[];
  services: any[];
  projects: any[];
  teamMembers: any[];
  processSteps: any[];
  contactInquiries: any[];
  seoSettings: any[];
  testimonials: any[];
  pricingPlans: any[];
}

const defaultDBData: LocalDBData = {
  admins: [],
  siteSettings: [],
  services: [],
  projects: [],
  teamMembers: [],
  processSteps: [],
  contactInquiries: [],
  seoSettings: [],
  testimonials: [],
  pricingPlans: [],
};

// Ensure data file exists
function ensureFileDB(): LocalDBData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultDBData, null, 2), 'utf-8');
    return defaultDBData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...defaultDBData, ...parsed };
  } catch (err) {
    return defaultDBData;
  }
}

function saveFileDB(data: LocalDBData) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(): string {
  return crypto.randomBytes(12).toString('hex');
}

// Universal Model Wrapper that uses Mongoose when connected or FileDB when local
function createModelWrapper<T>(
  collectionKey: keyof LocalDBData,
  MongooseModel: any
) {
  return {
    async find(filter: Record<string, any> = {}, options?: { sort?: Record<string, number> }): Promise<T[]> {
      if (getIsMongooseConnected()) {
        let query = MongooseModel.find(filter);
        if (options?.sort) {
          query = query.sort(options.sort);
        }
        return await query.lean().exec();
      }

      const db = ensureFileDB();
      let list = db[collectionKey] || [];

      // Basic filtering
      let result = list.filter((item) => {
        for (const [k, v] of Object.entries(filter)) {
          if (item[k] !== v) return false;
        }
        return true;
      });

      // Basic sorting
      if (options?.sort) {
        const [sortKey, sortDir] = Object.entries(options.sort)[0];
        result.sort((a, b) => {
          if (a[sortKey] === b[sortKey]) return 0;
          if (a[sortKey] === undefined) return 1;
          if (b[sortKey] === undefined) return -1;
          return sortDir === -1
            ? a[sortKey] < b[sortKey] ? 1 : -1
            : a[sortKey] > b[sortKey] ? 1 : -1;
        });
      }

      return JSON.parse(JSON.stringify(result));
    },

    async findOne(filter: Record<string, any> = {}): Promise<T | null> {
      if (getIsMongooseConnected()) {
        return await MongooseModel.findOne(filter).lean().exec();
      }

      const db = ensureFileDB();
      const list = db[collectionKey] || [];
      const item = list.find((el) => {
        for (const [k, v] of Object.entries(filter)) {
          if (k === '_id' || k === 'id') {
            if (el._id !== v && el.id !== v) return false;
          } else if (el[k] !== v) {
            return false;
          }
        }
        return true;
      });
      return item ? JSON.parse(JSON.stringify(item)) : null;
    },

    async findById(id: string): Promise<T | null> {
      if (getIsMongooseConnected()) {
        return await MongooseModel.findById(id).lean().exec();
      }
      return this.findOne({ _id: id });
    },

    async create(docData: Partial<T>): Promise<T> {
      if (getIsMongooseConnected()) {
        const doc = await MongooseModel.create(docData);
        return doc.toObject();
      }

      const db = ensureFileDB();
      const now = new Date();
      const _id = generateId();
      const newDoc = {
        _id,
        id: _id,
        ...docData,
        createdAt: now,
        updatedAt: now,
      };

      db[collectionKey].push(newDoc);
      saveFileDB(db);
      return JSON.parse(JSON.stringify(newDoc));
    },

    async findByIdAndUpdate(id: string, updateData: Partial<T>, options: { new?: boolean } = { new: true }): Promise<T | null> {
      if (getIsMongooseConnected()) {
        return await MongooseModel.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
      }

      const db = ensureFileDB();
      const list = db[collectionKey] || [];
      const index = list.findIndex((item) => item._id === id || item.id === id);

      if (index === -1) return null;

      const updated = {
        ...list[index],
        ...updateData,
        updatedAt: new Date(),
      };

      list[index] = updated;
      db[collectionKey] = list;
      saveFileDB(db);

      return JSON.parse(JSON.stringify(updated));
    },

    async findOneAndUpdate(filter: Record<string, any>, updateData: Partial<T>, options: { upsert?: boolean; new?: boolean } = { new: true }): Promise<T | null> {
      if (getIsMongooseConnected()) {
        return await MongooseModel.findOneAndUpdate(filter, updateData, { new: true, upsert: options.upsert }).lean().exec();
      }

      const db = ensureFileDB();
      const list = db[collectionKey] || [];
      const index = list.findIndex((item) => {
        for (const [k, v] of Object.entries(filter)) {
          if (item[k] !== v) return false;
        }
        return true;
      });

      if (index === -1) {
        if (options.upsert) {
          return await this.create({ ...filter, ...updateData } as Partial<T>);
        }
        return null;
      }

      const updated = {
        ...list[index],
        ...updateData,
        updatedAt: new Date(),
      };

      list[index] = updated;
      db[collectionKey] = list;
      saveFileDB(db);

      return JSON.parse(JSON.stringify(updated));
    },

    async findByIdAndDelete(id: string): Promise<T | null> {
      if (getIsMongooseConnected()) {
        return await MongooseModel.findByIdAndDelete(id).lean().exec();
      }

      const db = ensureFileDB();
      const list = db[collectionKey] || [];
      const index = list.findIndex((item) => item._id === id || item.id === id);

      if (index === -1) return null;

      const deleted = list.splice(index, 1)[0];
      db[collectionKey] = list;
      saveFileDB(db);

      return JSON.parse(JSON.stringify(deleted));
    },

    async countDocuments(filter: Record<string, any> = {}): Promise<number> {
      if (getIsMongooseConnected()) {
        return await MongooseModel.countDocuments(filter);
      }

      const db = ensureFileDB();
      const list = db[collectionKey] || [];
      return list.filter((item) => {
        for (const [k, v] of Object.entries(filter)) {
          if (item[k] !== v) return false;
        }
        return true;
      }).length;
    },

    async deleteMany(filter: Record<string, any> = {}): Promise<{ deletedCount: number }> {
      if (getIsMongooseConnected()) {
        return await MongooseModel.deleteMany(filter);
      }

      const db = ensureFileDB();
      const list = db[collectionKey] || [];
      
      // If filter is empty, clear everything
      if (Object.keys(filter).length === 0) {
        const deletedCount = list.length;
        db[collectionKey] = [];
        saveFileDB(db);
        return { deletedCount };
      }

      const keep = list.filter((item) => {
        for (const [k, v] of Object.entries(filter)) {
          if (item[k] === v) return false;
        }
        return true;
      });
      const deletedCount = list.length - keep.length;
      db[collectionKey] = keep;
      saveFileDB(db);
      return { deletedCount };
    },

    async aggregate(pipeline: any[]): Promise<any[]> {
      if (getIsMongooseConnected()) {
        return await MongooseModel.aggregate(pipeline).exec();
      }

      // Basic local fallback for analytics
      const db = ensureFileDB();
      let data = [...(db[collectionKey] || [])];

      for (const stage of pipeline) {
        if (stage.$match) {
          const match = stage.$match;
          data = data.filter((item: any) => {
            for (const key in match) {
              const condition = match[key];
              if (condition && typeof condition === 'object') {
                if (condition.$gte && new Date(item[key]) < new Date(condition.$gte)) return false;
                if (condition.$lte && new Date(item[key]) > new Date(condition.$lte)) return false;
              } else if (item[key] !== condition) {
                return false;
              }
            }
            return true;
          });
        }

        if (stage.$group) {
          const group = stage.$group;
          const grouped: Record<string, any> = {};
          data.forEach((item: any) => {
            let key = '';
            if (typeof group._id === 'string' && group._id.startsWith('$')) {
              key = item[group._id.substring(1)];
            } else if (group._id && group._id.$dateToString) {
              const field = group._id.$dateToString.date.substring(1);
              const date = new Date(item[field]);
              key = date.toISOString().split('T')[0];
            } else {
              key = 'total';
            }

            if (!grouped[key]) {
              grouped[key] = { _id: key, count: 0 };
            }
            if (group.count?.$sum) {
              grouped[key].count += group.count.$sum;
            } else {
              grouped[key].count += 1;
            }
          });
          data = Object.values(grouped);
        }

        if (stage.$sort) {
          const sort = stage.$sort;
          const [sortKey, sortDir] = Object.entries(sort)[0] as [string, number];
          data.sort((a: any, b: any) => {
            if (a[sortKey] === b[sortKey]) return 0;
            return sortDir === -1
              ? a[sortKey] < b[sortKey] ? 1 : -1
              : a[sortKey] > b[sortKey] ? 1 : -1;
          });
        }
      }

      return JSON.parse(JSON.stringify(data));
    }
  };
}

export const Admin = createModelWrapper<IAdmin>('admins', AdminModel);
export const SiteSettings = createModelWrapper<ISiteSettings>('siteSettings', SiteSettingsModel);
export const Service = createModelWrapper<IService>('services', ServiceModel);
export const Project = createModelWrapper<IProject>('projects', ProjectModel);
export const TeamMember = createModelWrapper<ITeamMember>('teamMembers', TeamMemberModel);
export const ProcessStep = createModelWrapper<IProcessStep>('processSteps', ProcessStepModel);
export const ContactInquiry = createModelWrapper<IContactInquiry>('contactInquiries', ContactInquiryModel);
export const SEOSettings = createModelWrapper<ISEOSettings>('seoSettings', SEOSettingsModel);
export const Testimonial = createModelWrapper<ITestimonial>('testimonials', TestimonialModel);
export const PricingPlan = createModelWrapper<IPricingPlan>('pricingPlans', PricingPlanModel);
