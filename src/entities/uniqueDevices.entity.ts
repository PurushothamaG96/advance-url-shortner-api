import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Url } from "./shortURL.entity";
import { User } from "./users.entity";

@Entity("unique_devices")
export class UniqueDevices {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  urlId: string;

  @ManyToOne(() => Url, (url) => url.uniqueDevices)
  url: Url;

  @Column()
  deviceName: string;

  @Column({ type: "uuid" })
  accessUserId: string;

  @ManyToOne(() => User, (user) => user.device)
  @JoinColumn({ name: "accessUserId", referencedColumnName: "id" })
  user: User;
}
