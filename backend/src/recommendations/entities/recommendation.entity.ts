import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  category: string; // Diet, Fitness, Sleep, Stress, Routine Checkups

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  priority: string; // High, Medium, Low

  @Column({ nullable: true })
  relatedMetric: string;

  @Column({ nullable: true })
  currentValue: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: false })
  isDismissed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

