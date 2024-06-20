import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class CreateAdminUser1717815432884 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = 10;
    const password = 'admin';
    const hashedPassword = await bcrypt.hash(password, salt);
    await queryRunner.query(
      `INSERT INTO "user_entity" (name, password, email) VALUES ('admin', '${hashedPassword}', 'admin@example.com')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "user_entity" WHERE email = 'admin@example.com' `,
    );
  }
}
