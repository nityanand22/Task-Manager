/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("user", (table) => {
      table.increments("id").primary();
      table.string("username").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
    })
    .then(() => {
      return knex.schema.createTable("tasks", (table) => {
        table.increments("id").primary();
        table.string("title").notNullable();
        table.text("description").notNullable();
        table.string("status").defaultTo("To Do");
        table
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("user")
          .onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("tasks")
    .then(() => knex.schema.dropTableIfExists("user"));
};
