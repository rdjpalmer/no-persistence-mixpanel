import { setupIdentification } from "./figma-code";

const mockFigma = {
  clientStorage: {
    getAsync: jest.fn(() => Promise.resolve("")),
    setAsync: jest.fn(() => Promise.resolve("")),
  },
  ui: {
    postMessage: jest.fn(),
  },
};

describe("setupIdentification", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("generates a uuid if one does not exist", async () => {
    // @ts-expect-error
    await setupIdentification(mockFigma);

    expect(mockFigma.clientStorage.setAsync).toHaveBeenCalledTimes(1);
    expect(mockFigma.clientStorage.setAsync).toHaveBeenCalledWith(
      "mixpanel-distinct-id",
      expect.any(String)
    );

    expect(mockFigma.ui.postMessage).toBeCalledTimes(1);
    expect(mockFigma.ui.postMessage).toBeCalledWith(
      expect.objectContaining({
        type: "mixpanel-identification",
        userId: expect.any(String),
      })
    );
  });

  it("returns the existing ID if one exists", async () => {
    mockFigma.clientStorage.getAsync.mockImplementation(() =>
      Promise.resolve("1234")
    );
    // @ts-expect-error
    await setupIdentification(mockFigma);

    expect(mockFigma.clientStorage.setAsync).toHaveBeenCalledTimes(0);

    expect(mockFigma.ui.postMessage).toBeCalledTimes(1);
    expect(mockFigma.ui.postMessage).toBeCalledWith(
      expect.objectContaining({
        type: "mixpanel-identification",
        userId: "1234",
      })
    );
  });
});
