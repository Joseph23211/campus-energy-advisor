import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import db from './knex';

async function migrate() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  if (!(await db.schema.hasTable('campus_metrics'))) {
    await db.schema.createTable('campus_metrics', (t) => {
      t.increments('id').primary();
      t.string('campus_name').defaultTo('Christ University Campus');
      t.float('total_energy_today').notNullable();
      t.float('energy_cost').notNullable();
      t.float('carbon_emissions').notNullable();
      t.float('renewable_percentage').notNullable();
      t.float('peak_demand').notNullable();
      t.float('efficiency_score').notNullable();
      t.timestamp('updated_at').defaultTo(db.fn.now());
    });
  }

  if (!(await db.schema.hasTable('buildings'))) {
    await db.schema.createTable('buildings', (t) => {
      t.string('id').primary();
      t.string('slug').unique().notNullable();
      t.string('name').notNullable();
      t.string('type').defaultTo('Academic');
      t.float('current_consumption').notNullable();
      t.float('baseline_consumption').notNullable();
      t.float('efficiency').notNullable();
      t.float('carbon_output').notNullable();
      t.float('temperature').notNullable();
      t.integer('occupancy').notNullable();
      t.string('status').notNullable();
      t.float('map_x');
      t.float('map_y');
      t.timestamp('created_at').defaultTo(db.fn.now());
      t.timestamp('updated_at').defaultTo(db.fn.now());
    });
  }

  if (!(await db.schema.hasTable('building_analytics'))) {
    await db.schema.createTable('building_analytics', (t) => {
      t.increments('id').primary();
      t.string('building_id').notNullable().references('id').inTable('buildings').onDelete('CASCADE');
      t.timestamp('timestamp').defaultTo(db.fn.now());
      t.float('hourly_consumption').notNullable();
      t.float('hvac_load').notNullable();
      t.float('lighting_load').notNullable();
      t.float('equipment_load').notNullable();
      t.float('solar_contribution').notNullable();
      t.float('temperature').notNullable();
      t.integer('occupancy').notNullable();
      t.index(['building_id', 'timestamp']);
    });
  }

  if (!(await db.schema.hasTable('energy_logs'))) {
    await db.schema.createTable('energy_logs', (t) => {
      t.increments('id').primary();
      t.timestamp('timestamp').defaultTo(db.fn.now());
      t.float('value').notNullable();
      t.float('cost').notNullable();
      t.float('peak_demand').notNullable();
      t.string('period_type').notNullable();
      t.string('label').notNullable();
      t.index(['period_type', 'timestamp']);
    });
  }

  if (!(await db.schema.hasTable('recommendations'))) {
    await db.schema.createTable('recommendations', (t) => {
      t.string('id').primary();
      t.string('title').notNullable();
      t.text('description').notNullable();
      t.string('building_id').references('id').inTable('buildings').onDelete('SET NULL');
      t.string('impact').defaultTo('Medium');
      t.string('priority').notNullable();
      t.string('difficulty').defaultTo('Medium');
      t.float('estimated_savings').notNullable();
      t.float('energy_reduction_pct').notNullable();
      t.float('co2_reduction').notNullable();
      t.string('status').defaultTo('Pending');
      t.timestamp('created_at').defaultTo(db.fn.now());
      t.timestamp('updated_at').defaultTo(db.fn.now());
    });
  }

  if (!(await db.schema.hasTable('alerts'))) {
    await db.schema.createTable('alerts', (t) => {
      t.string('id').primary();
      t.string('building_id').references('id').inTable('buildings').onDelete('SET NULL');
      t.string('title').notNullable();
      t.text('description').notNullable();
      t.string('severity').notNullable();
      t.timestamp('timestamp').defaultTo(db.fn.now());
      t.boolean('resolved').defaultTo(false);
    });
  }

  console.log('Migrations complete.');
}

if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default migrate;
