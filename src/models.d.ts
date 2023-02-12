export interface Card extends ArchiveCard {
  archives: boolean;
}

export interface TaskList {
  sectionId: string;
  sectionName: string;
  archives: boolean;
  cardList: Card[];
}

export interface ArchiveCard {
  cardId: string;
  cardName: string;
  priority: 'none' | 'high' | 'middle' | 'low';
  cleared: boolean;
  deleted: boolean;
}
