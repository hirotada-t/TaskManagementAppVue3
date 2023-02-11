export interface Card extends ArchiveCard {
  archives: false;
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
  checked: boolean;
  deleted: boolean;
}
