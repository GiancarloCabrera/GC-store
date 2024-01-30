import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from './apikey.entity';

@Injectable()
export class ApiKeysRepository {
  private keys: ApiKeyEntity[] = [
    {
      name: 'Test Client Key',
      key: process.env.API_KEY,
    },
  ];

  public findOne(key: string): ApiKeyEntity {
    console.log(this.keys.find((apikey) => key === apikey.key));

    return this.keys.find((apikey) => key === apikey.key);
  }
}
