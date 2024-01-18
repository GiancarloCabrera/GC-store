import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from './apikey.entity';

@Injectable()
export class ApiKeysRepository {
  private keys: ApiKeyEntity[] = [
    {
      name: 'Test Client Key',
      key: 'jisad-njksc2039u823nj-r23jff3f',
    },
  ];

  public findOne(key: string): ApiKeyEntity {
    console.log(this.keys.find((apikey) => key === apikey.key));

    return this.keys.find((apikey) => key === apikey.key);
  }
}
