
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

export const initialMessage: Message = {
  id: '1',
  text: "Hello! I'm BOB, your KHRATE assistant. How can I help you today? I can assist with shopping, bundles, checkout, and more.",
  sender: 'bot',
  timestamp: new Date(),
};
