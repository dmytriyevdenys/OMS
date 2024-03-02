import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStatuses1708147447702 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            INSERT INTO "order_status_entity" ("name", "alias", "color", "is_active") VALUES
            ('Нове замовлення', 'new', '#36B441', true),
            ('Приймає рішення', 'choice_decisions', '#6A6588', true),
            ('Очікуєм на оплату', 'waiting_for_prepayment', '#2078FF', true),
            ('Прийнято в роботу', 'accepted', '#0052CC', true),
            ('В роботі', 'transferred_to_production', '#DA24BD', true),
            ('Створена накладна', 'created_internet_document', '#DE8A0B', true),
            ('Упаковано', 'packed', '#0CDBF2', true),
            ('Виконано', 'completed', '#00875A', true),
            ('Відміна', 'canceled', '#DE350B', true),
            ('У дорозі', 'delivery', '#0747A6', true),
            (' Прибув у відділення', 'delivered', '#0747A6', true),
            ('Доставлено, нак. платіж у дорозі', 'payment_delivery', '#0747A6', true),
            ('Повертається', 'returns', '#0747A6', true),
            ('Утилізація', 'utilization', '#0747A6', true),
            ('Помилка доставки', 'delivery_error', '#F20C0C', true)
        `);


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order_status_entity"`);
    }
}
