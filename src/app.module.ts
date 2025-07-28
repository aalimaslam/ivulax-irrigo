import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { InfraModule } from './infra/infra.module';

@Module({
  imports: [CoreModule, InfraModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
