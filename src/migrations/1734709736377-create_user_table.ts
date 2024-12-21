import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1734709736377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isUnique: true,
            generationStrategy: "uuid",
            default: `uuid_generate_v4()`,
          },
          {
            name: "googleId",
            type: "text",
            isUnique: true,
          },
          {
            name: "email",
            type: "text",
            isNullable: false,
          },
          {
            name: "name",
            type: "text",
            isNullable: false,
          },
          {
            name: "profileUrl",
            type: "text",
            isNullable: true,
            default: null,
          },
          {
            name: "createdAt",
            type: "timestamptz",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamptz",
            default: "now()",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user");
  }
}
