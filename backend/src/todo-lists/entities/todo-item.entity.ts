import { ApiProperty } from "@nestjs/swagger";

export class TodoItem {
  @ApiProperty({
    description: 'ID of the todo item',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the todo item',
    example: 'Buy milk',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the todo item',
    example: 'Buy a gallon of milk from the store',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Whether the todo item is done',
    example: false,
  })
  done: boolean;

  @ApiProperty({
    description: 'Order position for drag and drop',
    example: 0,
  })
  order: number;
}
