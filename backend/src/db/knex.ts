import path from 'path';
import Knex from 'knex';

const filename = process.env.DB_FILENAME || './data/energix.sqlite3';

const db = Knex({
  client: 'better-sqlite3',
  connection: {
    filename: path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename),
  },
  useNullAsDefault: true,
});

export default db;
