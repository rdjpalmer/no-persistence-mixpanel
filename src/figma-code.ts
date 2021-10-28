function createUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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
    userId = createUUID();
    figma.clientStorage.setAsync("mixpanel-distinct-id", userId);
  }

  figma.ui.postMessage({ type: "mixpanel-identification", userId });
}
