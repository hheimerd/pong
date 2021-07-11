import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, length: 32 })
  login: string;

  @Column({ select: false })
  password: string;
}
