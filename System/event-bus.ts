import { remove } from "./array";
import { onMounted, onUnmounted } from "vue";

type Listener<T = unknown> = (payload: T) => void;

const topics: Record<string, Listener<any>[]> = Object.create(null);

// This is meant to be used from Components (it automatically calls off when unmounting)
export function listen<T>(topic: string, listener: Listener<T>) {
  onMounted(() => on(topic, listener));
  onUnmounted(() => off(topic, listener));
}

export function on<T>(topic: string, listener: Listener<T>) {
  const listeners = topics[topic];
  if (listeners) listeners.push(listener);
  else topics[topic] = [listener];
}

export function off<T>(topic: string, listener: Listener<T>) {
  const listeners = topics[topic];
  if (listeners) remove(listeners, listener);
}

export function emit(topic: string, payload?: unknown): unknown {
  let result: unknown;
  topics[topic]?.forEach(listener => (result = listener(payload)));
  return result;
}
