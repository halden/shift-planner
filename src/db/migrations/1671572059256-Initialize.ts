import { hash } from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '../../users/enums/role.enum';

export class Initialize1671572059256 implements MigrationInterface {
  name = 'Initialize1671572059256';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = await hash('qwerty', 10);

    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password_hash\` varchar(255) NOT NULL, \`role\` enum ('staff', 'admin') NOT NULL DEFAULT 'staff', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`total\` smallint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`shifts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` int NOT NULL, \`hours\` tinyint NOT NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shifts\` ADD CONSTRAINT \`FK_7862b9a401e0fe7dc5ef96e9116\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('users', ['name', 'email', 'password_hash', 'role'])
      .values([
        {
          name: 'Alice',
          email: 'alice@symbolics.com',
          password_hash: passwordHash,
          role: Role.Admin,
        },
        {
          name: 'Bob',
          email: 'bob@symbolics.com',
          password_hash: passwordHash,
          role: Role.Staff,
        },
      ])
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('shifts')
      .values([
        { date: 1671487200, hours: 4, user: { id: 1 } },
        { date: 1672524000, hours: 4, user: { id: 1 } },
        { date: 1672869600, hours: 4, user: { id: 1 } },
        { date: 1681400800, hours: 8, user: { id: 1 } },
        { date: 1704405600, hours: 8, user: { id: 1 } },
        { date: 1671487200, hours: 4, user: { id: 2 } },
        { date: 1672524000, hours: 6, user: { id: 2 } },
        { date: 1672869600, hours: 4, user: { id: 2 } },
        { date: 1681400800, hours: 4, user: { id: 2 } },
        { date: 1704405600, hours: 8, user: { id: 2 } },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`shifts\` DROP FOREIGN KEY \`FK_7862b9a401e0fe7dc5ef96e9116\``);
    await queryRunner.query(`DROP TABLE \`shifts\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
