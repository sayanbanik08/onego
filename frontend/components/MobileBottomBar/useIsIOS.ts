import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

const getSnapshot = () =>
  typeof navigator !== "undefined" &&
  (/iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

const getServerSnapshot = () => false;

export default function useIsIOS() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
