export class TransactionResponseDto {
  id: number;
  description: string;
  value: number;
  type: 'ENTRY' | 'EXIT';
  date: Date;
  userId: number;
  category: {
    id: number;
    name: string;
  };
}
