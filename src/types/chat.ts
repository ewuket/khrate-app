
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

export const initialMessage: Message = {
  id: '1',
  text: "Hello! I'm BOB, your intelligent KHRATE assistant. I can help you with everything from shopping and bundles to orders, deliveries, payments, account issues, and general questions. I speak both English and Kinyarwanda. How can I assist you today?",
  sender: 'bot',
  timestamp: new Date(),
};
