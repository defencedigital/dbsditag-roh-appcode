import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RollOfHonour {
  @Column({ nullable: true })
  pkid: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  serial_no: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  forenames: string;

  @Column({ nullable: true })
  decorations: string;

  @Column({ nullable: true })
  rank: string;

  @Column({ nullable: true })
  service_no: string;

  @Column({ nullable: true })
  regt_corps: string;

  @Column({ nullable: true })
  birth_date: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  service: string;

  @Column({ nullable: true })
  memorial: string;

  @Column({ nullable: true })
  nom_roll: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  death_date: string;

  @Column({ nullable: true })
  cemetery_name: string;

  @Column({ nullable: true })
  cemetery_address_1: string;

  @Column({ nullable: true })
  cemetery_address_2: string;

  @Column({ nullable: true })
  cemetery_address_3: string;

  @Column({ nullable: true })
  cemetery_address_4: string;

  @Column({ nullable: true })
  cemetery_postcode: string;

  @Column({ nullable: true })
  grave_section: string;

  @Column({ nullable: true })
  grave_row: string;

  @Column({ nullable: true })
  grave_number: string;

  @Column({ nullable: true })
  headstone_inscription: string;
}
