import * as fs from 'fs';

export default class Store {
    list = [];

    push(data) {
        this.list.push(data);
    }

    flush(path = './data.json') {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(this.list), (err) => {
                if (err) {
                    console.log('flush error: ', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }
}
