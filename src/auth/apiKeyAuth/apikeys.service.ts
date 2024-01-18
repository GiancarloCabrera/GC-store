import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from './apikey.entity';
import { ApiKeysRepository } from './apikey.repository';

@Injectable()
export class ApiKeysService {
  constructor(private apiKeyRepository: ApiKeysRepository) {
    // console.log("paso por ");
  }

  public findKey(key: string): ApiKeyEntity {
    console.log(key);

    return this.apiKeyRepository.findOne(key);
  }
}
