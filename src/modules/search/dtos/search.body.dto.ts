import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public query: string;
}
