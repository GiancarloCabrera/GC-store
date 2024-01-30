import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from './apikey.entity';
import { ApiKeysRepository } from './apikey.repository';

@Injectable()
export class ApiKeysService {
  constructor(private apiKeyRepository: ApiKeysRepository) { }

  public findKey(key: string): ApiKeyEntity {
    return this.apiKeyRepository.findOne(key);
  }
}
