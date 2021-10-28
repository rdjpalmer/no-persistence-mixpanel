import Mixpanel from ".";
import { init } from "./figma-ui";

function makeMockFigmaMessage() {
  return {
    data: {
      pluginMessage: { type: "mixpanel-identification", userId: "1234" },
    },
  };
}

describe("Figma UI initialiser", () => {
  it("returns a mixpanel instance when the identification event is fired", async () => {
    init("dummy-token", (mixpanel) => {
      expect(mixpanel).toBeInstanceOf(Mixpanel);
    });

    window.postMessage(makeMockFigmaMessage(), "*");
  });
});
