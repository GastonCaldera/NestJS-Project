import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
  _id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  key: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
