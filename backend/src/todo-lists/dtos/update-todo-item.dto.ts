import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AddTodoItemDto } from './add-todo-item.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateTodoItemDto extends PartialType(AddTodoItemDto) {
  @ApiProperty({
    description: 'Whether the todo item is done',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  done?: boolean;

  @ApiProperty({
    description: 'Order position for drag and drop',
    example: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  order?: number;
}
