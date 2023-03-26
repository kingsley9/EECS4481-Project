export interface Message {
  id: string;
  sender: string;
  message: string;
  session: string;
  timestamp: Date;
  files: { filename: string, fileUrl: string }[];
}
