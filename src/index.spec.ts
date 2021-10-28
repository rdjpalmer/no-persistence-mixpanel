import Mixpanel from ".";

describe("Mixpanel library", () => {
  describe("#track", () => {
    it("does not track without a identification", () => {
      const mixpanel = new Mixpanel("dummy-token");

      expect(() => mixpanel.track("test")).toThrowErrorMatchingSnapshot();
    });

    it("tracks the given event", async () => {
      const mixpanel = new Mixpanel("dummy-token");
      mixpanel.identify("1234");

      const response = await mixpanel.track("Page Viewed", { loggedIn: true });
      const parameters = new URLSearchParams(await response.json());
      const jsonString = parameters.get("data");
      const data = jsonString ? JSON.parse(jsonString) : {};

      expect(response.status).toBe(200);
      expect(response.url).toBe("https://api.mixpanel.com/track");
      expect(data).toEqual({
        event: "Page Viewed",
        properties: {
          loggedIn: true,
          distinct_id: "1234",
          token: "dummy-token",
        },
      });
    });
  });

  describe("#setUserProperty", () => {
    it("does not set the user property without a identification", () => {
      const mixpanel = new Mixpanel("dummy-token");

      expect(() =>
        mixpanel.setUserProperty({ key: "value" })
      ).toThrowErrorMatchingSnapshot();
    });

    it("sets the user property", async () => {
      const mixpanel = new Mixpanel("dummy-token");
      mixpanel.identify("1234");

      const response = await mixpanel.setUserProperty({ hasAccount: true });
      const parameters = new URLSearchParams(await response.json());
      const jsonString = parameters.get("data");
      const data = jsonString ? JSON.parse(jsonString) : {};

      expect(response.status).toBe(200);
      expect(response.url).toBe("https://api.mixpanel.com/engage#profile-set");
      expect(data).toEqual({
        $set: {
          hasAccount: true,
        },
        distinct_id: "1234",
        token: "dummy-token",
      });
    });
  });

  describe("#setUserPropertyOnce", () => {
    it("does not set the user property without a identification", () => {
      const mixpanel = new Mixpanel("dummy-token");

      expect(() =>
        mixpanel.setUserPropertyOnce({ key: "value" })
      ).toThrowErrorMatchingSnapshot();
    });

    it("sets the user property once", async () => {
      const mixpanel = new Mixpanel("dummy-token");
      mixpanel.identify("1234");

      const response = await mixpanel.setUserPropertyOnce({ hasAccount: true });
      const parameters = new URLSearchParams(await response.json());
      const jsonString = parameters.get("data");
      const data = jsonString ? JSON.parse(jsonString) : {};

      expect(response.status).toBe(200);
      expect(response.url).toBe(
        "https://api.mixpanel.com/engage#profile-set-once"
      );
      expect(data).toEqual({
        $set_once: {
          hasAccount: true,
        },
        distinct_id: "1234",
        token: "dummy-token",
      });
    });
  });

  describe("#incrementUserNumericalProperty", () => {
    it("does not set the user property without a identification", () => {
      const mixpanel = new Mixpanel("dummy-token");

      expect(() =>
        mixpanel.incrementUserNumericalProperty({ key: 12 })
      ).toThrowErrorMatchingSnapshot();
    });

    it("sets the user property once", async () => {
      const mixpanel = new Mixpanel("dummy-token");
      mixpanel.identify("1234");

      const response = await mixpanel.incrementUserNumericalProperty({
        bitcoins: 100,
      });
      const parameters = new URLSearchParams(await response.json());
      const jsonString = parameters.get("data");
      const data = jsonString ? JSON.parse(jsonString) : {};

      expect(response.status).toBe(200);
      expect(response.url).toBe(
        "https://api.mixpanel.com/engage#profile-numerical-add"
      );
      expect(data).toEqual({
        $add: {
          bitcoins: 100,
        },
        distinct_id: "1234",
        token: "dummy-token",
      });
    });
  });

  describe("#unionUserListProperty", () => {
    it("does not unionise the property without a identification", () => {
      const mixpanel = new Mixpanel("dummy-token");

      expect(() =>
        mixpanel.unionUserListProperty({ key: ["value"] })
      ).toThrowErrorMatchingSnapshot();
    });

    it("unionises the given properties", async () => {
      const mixpanel = new Mixpanel("dummy-token");
      mixpanel.identify("1234");

      const response = await mixpanel.unionUserListProperty({
        items: ["sword", "shield"],
      });
      const parameters = new URLSearchParams(await response.json());
      const jsonString = parameters.get("data");
      const data = jsonString ? JSON.parse(jsonString) : {};

      expect(response.status).toBe(200);
      expect(response.url).toBe(
        "https://api.mixpanel.com/engage#profile-union"
      );
      expect(data).toEqual({
        $union: {
          items: ["sword", "shield"],
        },
        distinct_id: "1234",
        token: "dummy-token",
      });
    });
  });

  describe("#appendUserListProperty", () => {
    it("does not append the property without a identification", () => {
      const mixpanel = new Mixpanel("dummy-token");

      expect(() =>
        mixpanel.appendUserListProperty({ key: "value" })
      ).toThrowErrorMatchingSnapshot();
    });

    it("appends the given properties", async () => {
      const mixpanel = new Mixpanel("dummy-token");
      mixpanel.identify("1234");

      const response = await mixpanel.appendUserListProperty({
        items: "arrow",
      });
      const parameters = new URLSearchParams(await response.json());
      const jsonString = parameters.get("data");
      const data = jsonString ? JSON.parse(jsonString) : {};

      expect(response.status).toBe(200);
      expect(response.url).toBe(
        "https://api.mixpanel.com/engage#profile-list-append"
      );
      expect(data).toEqual({
        $append: {
          items: "arrow",
        },
        distinct_id: "1234",
        token: "dummy-token",
      });
    });
  });

  describe("#removeUserListProperty", () => {
    it("does not remove the property without a identification", () => {
      const mixpanel = new Mixpanel("dummy-token");

      expect(() =>
        mixpanel.removeUserListProperty({ key: "value" })
      ).toThrowErrorMatchingSnapshot();
    });

    it("removes the given properties", async () => {
      const mixpanel = new Mixpanel("dummy-token");
      mixpanel.identify("1234");

      const response = await mixpanel.removeUserListProperty({
        items: "arrow",
      });
      const parameters = new URLSearchParams(await response.json());
      const jsonString = parameters.get("data");
      const data = jsonString ? JSON.parse(jsonString) : {};

      expect(response.status).toBe(200);
      expect(response.url).toBe(
        "https://api.mixpanel.com/engage#profile-list-remove"
      );
      expect(data).toEqual({
        $remove: {
          items: "arrow",
        },
        distinct_id: "1234",
        token: "dummy-token",
      });
    });
  });

  describe("#removeUserProperty", () => {
    it("does not remove the user property without a identification", () => {
      const mixpanel = new Mixpanel("dummy-token");

      expect(() =>
        mixpanel.removeUserProperty(["hasAccount"])
      ).toThrowErrorMatchingSnapshot();
    });

    it("removes the user property", async () => {
      const mixpanel = new Mixpanel("dummy-token");
      mixpanel.identify("1234");

      const response = await mixpanel.removeUserProperty(["hasAccount"]);
      const parameters = new URLSearchParams(await response.json());
      const jsonString = parameters.get("data");
      const data = jsonString ? JSON.parse(jsonString) : {};

      expect(response.status).toBe(200);
      expect(response.url).toBe(
        "https://api.mixpanel.com/engage#profile-unset"
      );
      expect(data).toEqual({
        $unset: ["hasAccount"],
        distinct_id: "1234",
        token: "dummy-token",
      });
    });
  });
});
