import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1734709736377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          { name: "id", type: "serial", isPrimary: true },
          { name: "googleId", type: "varchar", isUnique: true },
          { name: "email", type: "varchar" },
          { name: "name", type: "varchar" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user");
  }
}
