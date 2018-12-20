class AbstractService {

    constructor() {
        this.db = null;
    }

    async get(filter = {}, select = {}) {
        return await this.db.get(filter, select);
    }

    remove(data) {
        console.log('data', data);
        return this.db.delete(data);
    }

    model() {
        return this.db.db();
    }

    now() {
        const now = new Date();
        const year = "" + now.getFullYear();
        let month = "" + (now.getMonth() + 1);
        if (month.length === 1) {
            month = "0" + month;
        }
        let day = "" + now.getDate();
        if (day.length === 1) {
            day = "0" + day;
        }
        let hour = "" + now.getHours();
        if (hour.length === 1) {
            hour = "0" + hour;
        }
        let minute = "" + now.getMinutes();
        if (minute.length === 1) {
            minute = "0" + minute;
        }
        let second = "" + now.getSeconds();
        if (second.length === 1) {
            second = "0" + second;
        }
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    }
}

module.exports = AbstractService;
