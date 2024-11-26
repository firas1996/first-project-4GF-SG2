class APIFeatures {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }
  filter() {
    let queryObj = { ...this.queryParams };
    const excludedFields = ["sort", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (opt) => `$${opt}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-created_at");
    }
    return this;
  }
  pagination() {
    const page = this.queryParams.page * 1 || 1;
    const limit = this.queryParams.limit * 1 || 3;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    if (this.queryParams.page) {
      const nbr = this.query.length;
      if (skip >= nbr) {
        console.log("you have passed the limit !!!");
      }
    }
    return this;
  }
}

module.exports = APIFeatures;
