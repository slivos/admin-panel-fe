type QueueEntry = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

const failedQueue: QueueEntry[] = [];

export let isRefreshing = false;

export function setIsRefreshing(value: boolean): void {
  isRefreshing = value;
}

export function enqueueFailedRequest(entry: QueueEntry): void {
  failedQueue.push(entry);
}

export function processQueue(error: unknown, token: string | null): void {
  for (const entry of failedQueue) {
    if (error) {
      entry.reject(error);
    } else {
      entry.resolve(token as string);
    }
  }
  failedQueue.length = 0;
}
