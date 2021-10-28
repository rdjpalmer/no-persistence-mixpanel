import Mixpanel from ".";

export function init(
  token: string,
  onInitialised: (mixpanel: Mixpanel) => void
) {
  const mixpanel = new Mixpanel(token);

  window.onmessage = (event) => {
    const message = event.data.pluginMessage;

    if (message.type === "mixpanel-identification") {
      mixpanel.identify(message.userId);
      onInitialised(mixpanel);
    }
  };
}
