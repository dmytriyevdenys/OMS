import { Module } from '@nestjs/common';
import { NovaposhtaController } from './novaposhta.controller';



@Module({
  imports: [

  ], 
  controllers: [NovaposhtaController],
  providers: [
  ],
  exports:[]
})
export class NovaposhtaModule {}
