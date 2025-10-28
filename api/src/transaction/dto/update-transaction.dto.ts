export class UpdateTransactionDto {
  description?: string;
  value?: number;
  type?: 'ENTRY' | 'EXIT';
  categoryId?: number;
  date?: string;
}
