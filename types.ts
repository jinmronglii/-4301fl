
export enum Tab {
  HOME = 'HOME',
  ASSEMBLY = 'ASSEMBLY',
  SAFETY = 'SAFETY',
  AI_ASSISTANT = 'AI_ASSISTANT',
  MAINTENANCE = 'MAINTENANCE'
}

export enum Technician {
  HINO = 'HINO',
  KOMATSU = 'KOMATSU'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  translatedText?: string;
  isShowingTranslation?: boolean;
  timestamp: Date;
  isError?: boolean;
  suggestions?: string[];
  techType?: Technician;
  fileData?: { data: string; mimeType: string };
}

export interface ChatSession {
  id: string;
  title: string;
  techType: Technician;
  messages: ChatMessage[];
  timestamp: Date;
}

export interface AssemblyStep {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface SafetyTip {
  title: string;
  description: string;
  iconName: string; 
  color: string;
}
