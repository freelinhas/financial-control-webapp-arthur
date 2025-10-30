export class TransactionResponseDto {
  id: number;
  description: string;
  value: string; // Usando string para precisão com decimal.js
  type: 'ENTRY' | 'EXIT';
  date: Date;
  userId: number;
  category: {
    id: number;
    name: string;
  };
}
