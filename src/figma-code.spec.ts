import { setupIdentification } from "./figma-code";

const mockFigma = {
  currentUser: {
    id: "1234",
  },
  ui: {
    postMessage: jest.fn(),
  },
};

describe("setupIdentification", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns the figma user's ID", async () => {
    await setupIdentification(mockFigma);

    expect(mockFigma.ui.postMessage).toBeCalledTimes(1);
    expect(mockFigma.ui.postMessage).toBeCalledWith(
      expect.objectContaining({
        type: "mixpanel-identification",
        userId: "1234",
      })
    );
  });
});
