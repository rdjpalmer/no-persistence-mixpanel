interface CurrentUser {
  id: string;
}

interface UIAPI {
  postMessage(pluginMessage: any, options?: UIPostMessageOptions): void;
}

interface Figma {
  readonly currentUser: CurrentUser;
  readonly ui: UIAPI;
}

export async function setupIdentification(figma: Figma) {
  figma.ui.postMessage({
    type: "mixpanel-identification",
    userId: figma.currentUser.id,
  });
}
