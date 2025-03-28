import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742928726157 implements MigrationInterface {
    name = 'Init1742928726157'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying, "created_by" character varying NOT NULL, CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_teams_role_enum" AS ENUM('leader', 'member')`);
        await queryRunner.query(`CREATE TABLE "users_teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."users_teams_role_enum" NOT NULL, "joined_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "team_id" uuid, CONSTRAINT "PK_31623515d59c2f66ed330d2a2b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."sprints_status_enum" AS ENUM('planning', 'active', 'completed')`);
        await queryRunner.query(`CREATE TABLE "sprints" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "goal" character varying, "status" "public"."sprints_status_enum" NOT NULL DEFAULT 'planning', "start_date" TIMESTAMP, "end_date" TIMESTAMP, "board_id" uuid, CONSTRAINT "PK_6800aa2e0f508561812c4b9afb4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "boards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "project_id" uuid, CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "board_columns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "order" integer NOT NULL, "board_id" uuid, CONSTRAINT "PK_e3da51ad65560ca495d3a621d32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."custom_columns_type_enum" AS ENUM('text', 'number', 'date', 'dropdown', 'checkbox')`);
        await queryRunner.query(`CREATE TABLE "custom_columns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" "public"."custom_columns_type_enum" NOT NULL, "options" json, "required" boolean NOT NULL DEFAULT false, "project_id" uuid, CONSTRAINT "PK_95a711835284b053b4387b2cb3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."filter_criteria_operator_enum" AS ENUM('equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'in')`);
        await queryRunner.query(`CREATE TABLE "filter_criteria" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "field" character varying NOT NULL, "operator" "public"."filter_criteria_operator_enum" NOT NULL, "value" json NOT NULL, "filter_id" uuid, CONSTRAINT "PK_e4789b8ae3661da8b002c5103a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "custom_filters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "is_public" boolean NOT NULL DEFAULT false, "created_by" character varying NOT NULL, "project_id" uuid, CONSTRAINT "PK_83a3b4364b00b10de6ee2fc63b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sprint_tasks" ("sprint_id" uuid NOT NULL, "task_id" uuid NOT NULL, CONSTRAINT "PK_62290daea68a4f204ded49e9743" PRIMARY KEY ("sprint_id", "task_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_04530ea752560389120894e3a5" ON "sprint_tasks" ("sprint_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_683bf1e48513690ff319a456b3" ON "sprint_tasks" ("task_id") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_token_expiry" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "task" ADD "board_column_id" uuid`);
        await queryRunner.query(`ALTER TABLE "task" ADD "assignee_id" uuid`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "key" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_63e67599567b2126cfef14e1474" UNIQUE ("key")`);
        await queryRunner.query(`CREATE TYPE "public"."projects_project_type_enum" AS ENUM('scrum', 'kanban')`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "project_type" "public"."projects_project_type_enum" NOT NULL DEFAULT 'scrum'`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "team_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users_teams" ADD CONSTRAINT "FK_ea5ea57b0ae9e319c407fcec71f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_teams" ADD CONSTRAINT "FK_90ec1c8561d564639f38d422dcb" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sprints" ADD CONSTRAINT "FK_c050c5f2e8cad28ad9820a467e9" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "boards" ADD CONSTRAINT "FK_1542ae826c0dfeaf4c79e07fc57" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board_columns" ADD CONSTRAINT "FK_55e6772f5b84a2fb358db473313" FOREIGN KEY ("board_id") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_5e3961a67dddffd8ab78ab589e2" FOREIGN KEY ("board_column_id") REFERENCES "board_columns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_75114a0b55080c15694f3d40ec9" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "custom_columns" ADD CONSTRAINT "FK_8934f36d80d3559ff31f9821bda" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "filter_criteria" ADD CONSTRAINT "FK_af3c48c2e3d187f53542c4540d3" FOREIGN KEY ("filter_id") REFERENCES "custom_filters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "custom_filters" ADD CONSTRAINT "FK_e7273a7a58a1b93bbb70f4f752d" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_ce17f8b1c8016554cafa2dc8fb5" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sprint_tasks" ADD CONSTRAINT "FK_04530ea752560389120894e3a50" FOREIGN KEY ("sprint_id") REFERENCES "sprints"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "sprint_tasks" ADD CONSTRAINT "FK_683bf1e48513690ff319a456b39" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sprint_tasks" DROP CONSTRAINT "FK_683bf1e48513690ff319a456b39"`);
        await queryRunner.query(`ALTER TABLE "sprint_tasks" DROP CONSTRAINT "FK_04530ea752560389120894e3a50"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_ce17f8b1c8016554cafa2dc8fb5"`);
        await queryRunner.query(`ALTER TABLE "custom_filters" DROP CONSTRAINT "FK_e7273a7a58a1b93bbb70f4f752d"`);
        await queryRunner.query(`ALTER TABLE "filter_criteria" DROP CONSTRAINT "FK_af3c48c2e3d187f53542c4540d3"`);
        await queryRunner.query(`ALTER TABLE "custom_columns" DROP CONSTRAINT "FK_8934f36d80d3559ff31f9821bda"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_75114a0b55080c15694f3d40ec9"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_5e3961a67dddffd8ab78ab589e2"`);
        await queryRunner.query(`ALTER TABLE "board_columns" DROP CONSTRAINT "FK_55e6772f5b84a2fb358db473313"`);
        await queryRunner.query(`ALTER TABLE "boards" DROP CONSTRAINT "FK_1542ae826c0dfeaf4c79e07fc57"`);
        await queryRunner.query(`ALTER TABLE "sprints" DROP CONSTRAINT "FK_c050c5f2e8cad28ad9820a467e9"`);
        await queryRunner.query(`ALTER TABLE "users_teams" DROP CONSTRAINT "FK_90ec1c8561d564639f38d422dcb"`);
        await queryRunner.query(`ALTER TABLE "users_teams" DROP CONSTRAINT "FK_ea5ea57b0ae9e319c407fcec71f"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "team_id"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "project_type"`);
        await queryRunner.query(`DROP TYPE "public"."projects_project_type_enum"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_63e67599567b2126cfef14e1474"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "key"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "assignee_id"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "board_column_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_token_expiry"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_token"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_683bf1e48513690ff319a456b3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_04530ea752560389120894e3a5"`);
        await queryRunner.query(`DROP TABLE "sprint_tasks"`);
        await queryRunner.query(`DROP TABLE "custom_filters"`);
        await queryRunner.query(`DROP TABLE "filter_criteria"`);
        await queryRunner.query(`DROP TYPE "public"."filter_criteria_operator_enum"`);
        await queryRunner.query(`DROP TABLE "custom_columns"`);
        await queryRunner.query(`DROP TYPE "public"."custom_columns_type_enum"`);
        await queryRunner.query(`DROP TABLE "board_columns"`);
        await queryRunner.query(`DROP TABLE "boards"`);
        await queryRunner.query(`DROP TABLE "sprints"`);
        await queryRunner.query(`DROP TYPE "public"."sprints_status_enum"`);
        await queryRunner.query(`DROP TABLE "users_teams"`);
        await queryRunner.query(`DROP TYPE "public"."users_teams_role_enum"`);
        await queryRunner.query(`DROP TABLE "teams"`);
    }

}
