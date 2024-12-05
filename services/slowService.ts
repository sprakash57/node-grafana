class SlowService {
  private getRandom(delays: (number | string)[]) {
    return delays[Math.floor(Math.random() * delays.length)];
  }

  executeTask() {
    const delayInMs = this.getRandom([200, 400, 600, 800, 1000, 2000, 3000]);
    const shouldThrowError = this.getRandom([1, 2, 3, 4, 5, 6, 7, 8]) === 4;

    if (shouldThrowError) {
      const randomError = this.getRandom([
        'Access Denied',
        'Not authorized',
        'Page not found',
        'Internal Server Error',
        'Bad Gateway',
        'Service Unavailable',
      ]);

      throw new Error(randomError as string);
    }

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(delayInMs);
      }, delayInMs as number);
    });
  }
}

export default new SlowService();
