import { string } from "joi";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  role: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
    select: false
  })
  refreshToken?: string;
}