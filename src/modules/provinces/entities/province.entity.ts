import { ClientEntity } from 'src/modules/client/entities/client.entity';
import { Town } from 'src/modules/town/entities/town.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
} from 'typeorm';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @OneToMany(() => Town, (town) => town.province)
  towns: Relation<Town>[];

  @OneToMany(() => ClientEntity, (client) => client.province)
  clients: Relation<ClientEntity>[];
}
