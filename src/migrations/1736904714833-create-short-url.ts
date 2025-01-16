import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateShortUrl1736904714833 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "urls",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: `uuid_generate_v4()`,
          },
          {
            name: "createdUserId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "longUrl",
            type: "text",
            isNullable: false,
          },
          {
            name: "shortCode",
            type: "text",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "topic",
            type: "text",
            isNullable: true,
            default: null,
          },
          {
            name: "createdAt",
            type: "timestamptz",
            default: "now()",
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "urls",
      new TableForeignKey({
        columnNames: ["createdUserId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("urls");
    await queryRunner.dropTable("urls");
  }
}
