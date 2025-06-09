export interface MockApiCallOptions<T> {
  data: T;
  minLatency?: number;
  maxLatency?: number;
  failureChance?: number;
}

export function mockApiCall<T>({
  data,
  minLatency = 500,
  maxLatency = 1500,
  failureChance = 0.1,
}: MockApiCallOptions<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const latency = Math.random() * (maxLatency - minLatency) + minLatency;
    setTimeout(() => {
      if (Math.random() < failureChance) {
        reject(new Error('Simulated API Failure'));
      } else {
        // Return a deep copy to prevent accidental mutation of mock data source
        resolve(JSON.parse(JSON.stringify(data)));
      }
    }, latency);
  });
}
