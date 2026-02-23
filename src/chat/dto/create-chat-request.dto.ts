export class CreateChatRequestDto {
  creatorId: string;
  message: string;
  briefUrl: string;
  startDate: Date;
  endDate: Date;
  proposedPrice: number;
}