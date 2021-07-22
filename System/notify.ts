import { emit } from "./event-bus";

export type NotifyLevel = "info" | "success" | "warn" | "error";

export function notify(level: NotifyLevel, title: string, message?: string) {
  emit("notify", { class: level, title, message });
}

const curry = (level: NotifyLevel) => (title: string, message?: string) =>
  notify(level, title, message);

export const info = curry("info");

export const success = curry("success");

export const warn = curry("warn");

export const error = curry("error");
