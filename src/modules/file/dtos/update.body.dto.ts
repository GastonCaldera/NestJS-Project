import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFileBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public fileName: string;
}
