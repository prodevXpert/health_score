import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { HealthData } from '../../health-data/entities/health-data.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  INSURER = 'insurer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: ['M', 'F', 'O'], nullable: true })
  gender: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  profilePhoto: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => HealthData, (healthData) => healthData.user)
  healthData: HealthData[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

