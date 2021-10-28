import { v4 as uuidv4 } from "uuid";

interface ClientStorageAPI {
  getAsync(key: string): Promise<any>;
  setAsync(key: string, value: any): Promise<void>;
}

interface UIAPI {
  show(): void;
  hide(): void;
  resize(width: number, height: number): void;
  close(): void;

  postMessage(pluginMessage: any, options?: UIPostMessageOptions): void;
  onmessage: MessageEventHandler | undefined;
  on(type: "message", callback: MessageEventHandler): void;
  once(type: "message", callback: MessageEventHandler): void;
  off(type: "message", callback: MessageEventHandler): void;
}

interface Figma {
  readonly clientStorage: ClientStorageAPI;
  readonly ui: UIAPI;
}

export async function setupIdentification(figma: Figma) {
  let userId = await figma.clientStorage.getAsync("mixpanel-distinct-id");

  if (!userId) {
    userId = uuidv4();
    figma.clientStorage.setAsync("mixpanel-distinct-id", userId);
  }

  figma.ui.postMessage({ type: "mixpanel-identification", userId });
}
