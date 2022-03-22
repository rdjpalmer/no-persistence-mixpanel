import Mixpanel from ".";
import { withMixpanel } from "./figma-ui";

function makeMockFigmaMessage(pluginMessage: Record<string, string>) {
  return { data: { pluginMessage } };
}

describe("Figma UI initialiser", () => {
  it("ignores non-mixpanel related messages", () => {
    window.postMessage(makeMockFigmaMessage({ name: "test-message" }), "*");

    window.onmessage = withMixpanel(
      (event) => {
        expect(event).toMatchObject({
          data: { pluginMesssage: { name: "test-message" } },
        });
      },
      { token: "1234" }
    );
  });

  it("provides the user-land message handler with the mixpanel instance", () => {
    window.postMessage(makeMockFigmaMessage({ name: "test-message" }), "*");

    window.onmessage = withMixpanel(
      (event, mixpanel) => {
        expect(mixpanel).toBeInstanceOf(Mixpanel);
      },
      { token: "1234" }
    );
  });

  it("identifies the user", async () => {
    window.postMessage(
      makeMockFigmaMessage({ type: "mixpanel-identification", userId: "1234" }),
      "*"
    );
    window.postMessage(makeMockFigmaMessage({ name: "test-message" }), "*");

    window.onmessage = withMixpanel(
      async (event, mixpanel) => {
        expect(
          mixpanel.track("Screen Viewed", { loggedIn: true })
        ).resolves.not.toThrow();
      },
      { token: "1234" }
    );
  });
});
