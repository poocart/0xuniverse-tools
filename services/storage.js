const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');


class Storage {
  constructor(storageName, defaultValues) {
    this.storageName = storageName;
    this.defaultValues = defaultValues;
  }

  async instance() {
    const adapter = new FileAsync(`${__dirname}/../storage/${this.storageName}.json`);
    const localDatabase = await low(adapter);
    localDatabase.defaults(this.defaultValues).write();
    return localDatabase;
  }
}

module.exports = Storage;
