import { Module } from '@nestjs/common';

import { ConfigurationModule } from './configuration/configugration.module';
import { LoggerModule } from './logger/logger.module';

@Module({
    imports: [LoggerModule, ConfigurationModule],
    // controllers: [CoreController],
    // providers: [CoreService],
})
export class CoreModule {}
