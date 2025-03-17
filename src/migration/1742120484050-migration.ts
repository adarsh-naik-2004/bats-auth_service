import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1742120484050 implements MigrationInterface {
    name = 'Migration1742120484050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "storeId" integer`)
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_c82cd4fa8f0ac4a74328abe997a" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "FK_c82cd4fa8f0ac4a74328abe997a"`,
        )
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "storeId"`)
    }
}
