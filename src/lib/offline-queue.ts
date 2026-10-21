export interface OfflineQueuedReceipt {
  id: string;
  timestamp: number;
  receiptHash: string;
  presetId?: string;
  receiptImage?: string;
  voiceTranscript?: string;
  simulatedZoneId: string;
  vendorName?: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  error?: string;
}

const STORAGE_KEY = "aegis_relief_offline_queue_v1";

export function getOfflineQueue(): OfflineQueuedReceipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OfflineQueuedReceipt[];
  } catch (err) {
    console.error("Failed to read offline queue from localStorage:", err);
    return [];
  }
}

export function saveOfflineQueue(queue: OfflineQueuedReceipt[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error("Failed to save offline queue to localStorage:", err);
  }
}

export function addToOfflineQueue(
  item: Omit<OfflineQueuedReceipt, "id" | "timestamp" | "status">
): OfflineQueuedReceipt {
  const current = getOfflineQueue();
  const newItem: OfflineQueuedReceipt = {
    ...item,
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    status: "QUEUED",
  };
  current.push(newItem);
  saveOfflineQueue(current);
  return newItem;
}

export function removeFromOfflineQueue(id: string): void {
  const current = getOfflineQueue();
  const filtered = current.filter((item) => item.id !== id);
  saveOfflineQueue(filtered);
}

export function updateOfflineQueueItem(
  id: string,
  updates: Partial<OfflineQueuedReceipt>
): void {
  const current = getOfflineQueue();
  const index = current.findIndex((item) => item.id === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updates };
    saveOfflineQueue(current);
  }
}

export function clearOfflineQueue(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear offline queue:", err);
  }
}
