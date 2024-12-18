import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  longUrl: string;

  @Column({ unique: true })
  shortCode: string;

  @Column({ nullable: true })
  topic: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User)
  user: User;
}
