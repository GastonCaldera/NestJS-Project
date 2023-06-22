import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchAndUploadBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public fileName: string;
}
