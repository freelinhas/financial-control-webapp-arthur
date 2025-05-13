export class CreateTransactionDto {
  description: string;
  value: number;
  type: 'ENTRY' | 'EXIT';
  categoryId: number;
}
