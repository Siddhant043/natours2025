import { Query } from "mongoose";

class APIFeatures<T> {
  query: Query<T[], T>; // Mongoose query
  queryString: Record<string, any>;
  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (matchedStr) => `$${matchedStr}`
    );
    const parsedQuery = JSON.parse(queryStr);
    this.query = this.query.find(parsedQuery);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortStr = this.queryString.sort.toString();
      const updatedSortStr = sortStr.split(",").join(" ");
      this.query = this.query.sort(updatedSortStr);
    }
    return this;
  }

  limitfields() {
    if (this.queryString.fields) {
      const fieldStr = this.queryString.fields.toString();
      const updatedFieldStr = fieldStr.split(",").join(" ");
      this.query = this.query.select(updatedFieldStr);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;
