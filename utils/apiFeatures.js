//class declaration---------------------------------------------------->
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 6;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
    sort() {
        this.query = this.query.sort("-createdAt");
        return this;
    }
}

//export class---------------------------------------------------->
module.exports = APIFeatures;
