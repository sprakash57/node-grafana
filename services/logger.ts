import axios from 'axios';

class LoggerService {
  private lokiUrl: string;
  constructor() {
    this.lokiUrl = `http://${process.env.IP_ADDRESS}:3100/loki/api/v1/push`;
  }

  private async log(level: string, message: string, context: Record<string, any>) {
    const lokiLogEntry = {
      streams: [
        {
          stream: {
            level,
            service: 'My_Backend_App',
          },
          values: [[String(Date.now() * 1000000), JSON.stringify({ message, ...context })]],
        },
      ],
    };

    try {
      await axios.post(this.lokiUrl, lokiLogEntry);
      console.log(JSON.stringify({ message, ...context }));
    } catch (error) {
      console.error('Error logging to Loki:', error);
    }
  }

  info(message: string, context: Record<string, any>) {
    this.log('info', message, context);
  }

  error(message: string, context: Record<string, any>) {
    this.log('error', message, context);
  }
}

export default new LoggerService();
