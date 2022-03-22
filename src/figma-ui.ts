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

type OnMessageHandler = (ev: MessageEvent<any>, mixpanel: Mixpanel) => any;
interface MixpanelOptions {
  token: string;
}

export function withMixpanel(
  onMessage: OnMessageHandler,
  options: MixpanelOptions
) {
  const mixpanel = new Mixpanel(options.token);

  return (event: MessageEvent<any>) => {
    onMessage(event, mixpanel);

    // if (typeof event?.data?.type !== "undefined" && typeof event?.data?.userId !== "undefined" && event.data.type === "mixpanel-identify") {
    //   const message = event.data.pluginMessage;
    //   mixpanel.identify(message.userId);
    // } else {
    //   onMessage()
    // }
  };
}
