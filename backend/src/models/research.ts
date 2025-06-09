import mongoose from 'mongoose';
import slugify from 'slugify';
import { toSlug } from '../utils/toSlug';

const researchSchema = new mongoose.Schema({
  research_id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: false },
  date: { type: Date, required: true },
  author: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  detail: { type: String, required: true },
});

researchSchema.pre('save', function (this: any, next: () => void) {
  if (this.isModified('title') || !this.slug) {
    // this.slug = slugify(this.title, { lower: true, strict: true });
    this.slug = toSlug(this.title);
  }
  next();
});


const Research = mongoose.model("Research", researchSchema);
export default Research;
