import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentMethods1709479578853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "payment_method_entity" ("name", "label") VALUES
      ('CashOnDelivery', 'Наложка'),
      ('Card', 'На карту'),
      ('Advance', 'Аванс');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "payment_method_entity" WHERE "name" IN ('CashOnDelivery', 'Card', 'Advance');
    `);
  }
}
