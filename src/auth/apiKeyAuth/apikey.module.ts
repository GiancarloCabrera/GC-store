import { Module } from "@nestjs/common";
import { ApiKeysService } from "./apikeys.service";
import { ApiKeysRepository } from "./apikey.repository";
import { ApiKeyGuard } from "./apikey.guard";
import { ApiKeysStrategy } from "./apikey.strategy";

@Module({
  providers: [ApiKeysService, ApiKeysRepository, ApiKeyGuard, ApiKeysStrategy]
})
export class ApiKeyModule { }