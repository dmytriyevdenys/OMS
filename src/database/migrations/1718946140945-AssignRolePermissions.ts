import { MigrationInterface, QueryRunner } from "typeorm"

export class AssignRolePermissions1718946140945 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const permissions = await queryRunner.query(`SELECT id FROM "permission_entity"`);
        const roles = await queryRunner.query(`SELECT id, alias FROM "role_entity"`);

        const rolePermissions = {
            'administrator': permissions.map(p => p.id),
            'manager': permissions.filter(p => p.group_name !== 'catalog').map(p => p.id),
            'packer': permissions.filter(p => p.group_name === 'orders').map(p => p.id),
            'stock_manager': permissions.filter(p => p.group_name === 'catalog').map(p => p.id),
        };
        for (const [roleAlias, permissionIds] of Object.entries(rolePermissions)) {
            const role = roles.find(r => r.alias === roleAlias);
            for (const permissionId of permissionIds) {
                await queryRunner.query(`
                    INSERT INTO "role_entity_permissions_permission_entity" ("roleEntityId", "permissionEntityId") VALUES
                    (${role.id}, ${permissionId})
                `);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "role_entity_permissions_permission_entity"`);
    }

}
