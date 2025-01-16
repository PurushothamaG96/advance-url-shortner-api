import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateUniqueDevices1737032666736 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "unique_devices",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: `uuid_generate_v4()`,
          },
          {
            name: "urlId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "accessUserId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "deviceName",
            type: "text",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "unique_devices",
      new TableForeignKey({
        columnNames: ["urlId"],
        referencedColumnNames: ["id"],
        referencedTableName: "urls",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
        "unique_devices",
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
    const table = await queryRunner.getTable("unique_devices");

    await queryRunner.dropTable("unique_devices");
  }
}
