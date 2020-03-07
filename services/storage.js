import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';


const Storage = (filename, defaultValues) => {
  const adapter = new FileAsync(`../storage/${filename}`);
  const localDatabase = low(adapter);
  localDatabase.defaults(defaultValues).write();
  return localDatabase;
};

export default Storage;
