import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateUniqueOs1737032680935 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "unique_os",
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
            name: "osName",
            type: "text",
            isNullable: false,
          },
          {
            name: "accessUserId",
            type: "uuid",
            isNullable: false,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "unique_os",
      new TableForeignKey({
        columnNames: ["urlId"],
        referencedColumnNames: ["id"],
        referencedTableName: "urls",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "unique_os",
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
    const table = await queryRunner.getTable("unique_os");

    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("urlId") !== -1
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey("unique_os", foreignKey);
      }
    }

    await queryRunner.dropTable("unique_os");
  }
}
