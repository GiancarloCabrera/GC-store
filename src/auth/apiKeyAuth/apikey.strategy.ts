import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ApiKeyEntity } from "./apikey.entity";
import { PassportStrategy } from "@nestjs/passport";
import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { ApiKeysService } from './apikeys.service';

@Injectable()
export class ApiKeysStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
  constructor(private readonly apiKeysService: ApiKeysService) {
    super({
      header: 'Authorization',
      prefix: 'Apikey '
    },
      false
    )
  }

  public validate(apikey: string): ApiKeyEntity {
    const key = this.apiKeysService.findKey(apikey);
    console.log(key);

    if (!key) {
      console.log("entro");

      throw new UnauthorizedException();
    }

    return key;
  }
}