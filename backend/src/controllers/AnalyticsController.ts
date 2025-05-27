import { Request, Response } from "express";
import { OmicsMap, OmicsType } from "../models/omics";

const getOmics = async (req: Request, res: Response) => {
  const type = req.params.type as OmicsType;
  const entry = OmicsMap[type];

  if (!entry) {
    return res
      .status(400)
      .json({ message: `Unknown type '${type}'` });
  }

  const { model: Model, primaryKey } = entry;
  const filter = req.params.id
    ? { [primaryKey]: req.params.id }
    : {};

  try {
    const data = await Model.find(filter).lean();
    res.json({ type, count: data.length, data });
  } catch (err: any) {
    console.error(`Error fetching ${type}:`, err);
    res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

export default { getOmics };
