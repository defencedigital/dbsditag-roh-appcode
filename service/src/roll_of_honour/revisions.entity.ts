import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('revisions')
export class Revisions extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  updated_by: string;

  @Column()
  table_updated: string;

  @Column({ nullable: true })
  timestamp: number;

  @Column({ nullable: true })
  updated_at: string;
}
