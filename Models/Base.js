class Base {
    async get(filter = {}, select = {}) {
        return await this.db.find(filter, select);
    }

    async insert(data) {
        return await this.db.insert(data);
    }

    async delete(filter = {}, multi = false) {
        return await this.db.remove(filter, {multi: multi});
    }

    model() {
        return this.db;
    }
}

module.exports = Base;
