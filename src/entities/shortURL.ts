import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./users";
import { Analytics } from "./analytics";
import { UniqueOS } from "./uniqueOs";
import { UniqueDevices } from "./uniqueDevices";

@Entity("urls")
export class Url {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  createdUserId: string;

  @Column()
  longUrl: string;

  @Column({ unique: true })
  shortCode: string;

  @Column({ nullable: true })
  topic: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.urls)
  @JoinColumn({ name: "createdUserId", referencedColumnName: "id" })
  user: User;

  @OneToMany(() => Analytics, (analytics) => analytics.shortUrl)
  analytics: Analytics[];

  @OneToMany(() => UniqueOS, (uniqueOS) => uniqueOS.url)
  uniqueOS: UniqueOS[];

  @OneToMany(() => UniqueDevices, (uniqueDevice) => uniqueDevice.url)
  uniqueDevices: UniqueDevices[];
}
