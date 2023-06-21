import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DownloadFilesBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public _id: string;
}
