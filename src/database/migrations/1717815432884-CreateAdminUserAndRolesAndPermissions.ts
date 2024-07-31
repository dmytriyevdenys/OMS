import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class CreateAdminUserAndRolesAndPermissions1717815432884 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = 10;
    const password = 'admin';
    const roleId = 1; 
    const hashedPassword = await bcrypt.hash(password, salt);

    await queryRunner.query(`
      INSERT INTO "role_entity" ("name", "alias", "color", "is_reserved", "statuses_all", "accepted_all") VALUES
      ('Administrator', 'administrator', '#2B347D', true, true, true),
      ('Manager', 'manager', '#5867DD', true, true, true),
      ('Packer', 'packer', '#FF5733', false, false, false),
      ('StockManager', 'stock_manager', '#FFC300', false, false, false)
  `);
  await queryRunner.query(`
      INSERT INTO "permission_entity" ("name", "guard_name", "group_name", "position") VALUES
      ('view_change_history', 'web', 'orders', 0),
      ('re_sync_order', 'web', 'orders', 1),
      ('view_all', 'web', 'orders', 2),
      ('view_related', 'web', 'orders', 3),
      ('create_order', 'web', 'orders', 4),
      ('manage_catalog', 'web', 'catalog', 0),
      ('view_clients', 'web', 'clients', 0),
      ('modify_clients', 'web', 'clients', 1)
  `);
    await queryRunner.query(
      `INSERT INTO "user_entity" (name, password, email, "roleId") VALUES ($1, $2, $3, $4)`,
      ['admin', hashedPassword, 'admin@example.com', roleId]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "permission_entity"`);
    await queryRunner.query(`DELETE FROM "role_entity"`);
    await queryRunner.query(
      `DELETE FROM "user_entity" WHERE email = $1`,
      ['admin@example.com']
    );
  }
}
