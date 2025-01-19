import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Url } from "./shortURL.entity";
import { User } from "./users.entity";

@Entity("unique_os")
export class UniqueOS {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  urlId: string;

  @ManyToOne(() => Url, (url) => url.uniqueOS)
  url: Url;

  @Column()
  osName: string;

  @Column({ type: "uuid" })
  accessUserId: string;

  @ManyToOne(() => User, (user) => user.os)
  @JoinColumn({ name: "accessUserId", referencedColumnName: "id" })
  user: User;
}
