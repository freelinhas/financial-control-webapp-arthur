export class CreateTransactionDto {
  description: string;
  value: string; // Usando string para precisão com decimal.js
  type: 'ENTRY' | 'EXIT';
  categoryId: number;
}
