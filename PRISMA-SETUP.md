### Setup Prisma

This project uses Prisma as an ORM to interact with the Neon database. Follow these steps to set up Prisma:

1. Install Prisma and prisma client:

```bash
bun install --save-dev prisma @prisma/client
```

2. Initialize Prisma in your project:

```bash
bun prisma init
```

\*\*You should see a new folder called `prisma` in your project directory, containing a file named `schema.prisma`.

3. Update the `DATABASE_URL` in the `.env` file with your Neon database connection string. You can find this in the Neon dashboard under your database settings.

4. Create your models in the `schema.prisma` file. For example:

```prisma
model User {
  id        String   @id @default(uuid())
  name      String?
  email     String?  @unique
  password  String?
  createdAt DateTime @default(now())
}
```

5. Generate the Prisma Client:

```bash
bun prisma generate
```

6. Migrate your database schema:

```bash
bun prisma migrate dev --name init
```

Table should be created in your Neon database. You can check this by going to the Neon dashboard and selecting your database. You should see a list of tables.

7. If you make changes to your Prisma schema, you can create a new migration with:

```bash
bun prisma migrate dev --name <migration_name>
```

Replace `<migration_name>` with a descriptive name for your migration. This will create a new migration file in the `prisma/migrations` folder and apply the changes to your database.

8. Run the Prisma Studio to view your database:

```bash
bun prisma studio
```

9. Seed the database with initial data (optional):

```bash
bun run seed:db
```
