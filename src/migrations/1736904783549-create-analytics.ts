import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateAnalytics1736904783549 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "analytics",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: `uuid_generate_v4()`,
          },
          {
            name: "sortUrlId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "accessUserId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "userAgent",
            type: "text",
            isNullable: false,
          },
          {
            name: "ipAddress",
            type: "text",
            isNullable: false,
          },
          {
            name: "geoLocator",
            type: "text",
            isNullable: false,
          },
          {
            name: "osName",
            type: "text",
            isNullable: false,
          },
          {
            name: "deviceName",
            type: "text",
            isNullable: false,
          },
          {
            name: "accessedAt",
            type: "timestamptz",
            default: "now()",
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "analytics",
      new TableForeignKey({
        columnNames: ["sortUrlId"],
        referencedColumnNames: ["id"],
        referencedTableName: "urls",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "analytics",
      new TableForeignKey({
        columnNames: ["accessUserId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("analytics");

    await queryRunner.dropTable("analytics");
  }
}
