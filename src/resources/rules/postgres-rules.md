# PostgreSQL Rules

When working with PostgreSQL in this project:

1. **Prisma First**: Prefer updating `schema.prisma` over manual SQL migrations if Prisma is present.
2. **Naming Conventions**: Use `snake_case` for table and column names in the database.
3. **Indexing**: Always add indexes to columns used in `WHERE` clauses or `JOIN` conditions.
4. **Data Integrity**: Use foreign key constraints and check constraints where appropriate.
5. **Performance**: Avoid `SELECT *`. Explicitly select required columns.
