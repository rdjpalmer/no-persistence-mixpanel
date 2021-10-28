import type { Dict } from "mixpanel-browser";

export default class Mixpanel {
  private token: string;
  private distinctId?: string;

  private readonly defaultOptions = {
    method: "POST",
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  constructor(token: string) {
    this.token = token;
  }

  public identify(distinctId: string): void {
    this.distinctId = distinctId;
  }

  public track(event: string, properties: Dict = {}): Promise<Response> {
    if (typeof this.distinctId === "undefined") {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.track"
      );
    }

    const options = {
      ...this.defaultOptions,
      body: new URLSearchParams({
        data: JSON.stringify({
          event,
          properties: {
            ...properties,
            distinct_id: this.distinctId,
            token: this.token,
          },
        }),
      }),
    };

    return fetch("https://api.mixpanel.com/track", options);
  }

  public setUserProperty(properties: Dict): Promise<Response> {
    if (typeof this.distinctId === "undefined") {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.setUserProperty"
      );
    }

    const options = {
      ...this.defaultOptions,
      body: new URLSearchParams({
        data: JSON.stringify({
          $set: properties,
          distinct_id: this.distinctId,
          token: this.token,
        }),
      }),
    };

    return fetch("https://api.mixpanel.com/engage#profile-set", options);
  }

  public setUserPropertyOnce(properties: Dict): Promise<Response> {
    if (typeof this.distinctId === "undefined") {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.setUserProperty"
      );
    }

    const options = {
      ...this.defaultOptions,
      body: new URLSearchParams({
        data: JSON.stringify({
          $set_once: properties,
          distinct_id: this.distinctId,
          token: this.token,
        }),
      }),
    };

    return fetch("https://api.mixpanel.com/engage#profile-set-once", options);
  }

  public incrementUserNumericalProperty(
    properties: Record<string, number>
  ): Promise<Response> {
    if (typeof this.distinctId === "undefined") {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.incrementUserNumbericalProperty"
      );
    }

    const options = {
      ...this.defaultOptions,
      body: new URLSearchParams({
        data: JSON.stringify({
          $add: properties,
          distinct_id: this.distinctId,
          token: this.token,
        }),
      }),
    };

    return fetch(
      "https://api.mixpanel.com/engage#profile-numerical-add",
      options
    );
  }

  public unionUserListProperty(
    properties: Record<string, string[]>
  ): Promise<Response> {
    if (typeof this.distinctId === "undefined") {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.unionUserListProperty"
      );
    }

    const options = {
      ...this.defaultOptions,
      body: new URLSearchParams({
        data: JSON.stringify({
          $union: properties,
          distinct_id: this.distinctId,
          token: this.token,
        }),
      }),
    };

    return fetch("https://api.mixpanel.com/engage#profile-union", options);
  }

  public appendUserListProperty(
    properties: Record<string, string>
  ): Promise<Response> {
    if (typeof this.distinctId === "undefined") {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.appendUserListProperty"
      );
    }

    const options = {
      ...this.defaultOptions,
      body: new URLSearchParams({
        data: JSON.stringify({
          $append: properties,
          distinct_id: this.distinctId,
          token: this.token,
        }),
      }),
    };

    return fetch(
      "https://api.mixpanel.com/engage#profile-list-append",
      options
    );
  }

  public removeUserListProperty(
    properties: Record<string, string>
  ): Promise<Response> {
    if (typeof this.distinctId === "undefined") {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.removeUserListProperty"
      );
    }

    const options = {
      ...this.defaultOptions,
      body: new URLSearchParams({
        data: JSON.stringify({
          $remove: properties,
          distinct_id: this.distinctId,
          token: this.token,
        }),
      }),
    };

    return fetch(
      "https://api.mixpanel.com/engage#profile-list-remove",
      options
    );
  }

  public removeUserProperty(properties: string[]): Promise<Response> {
    if (typeof this.distinctId === "undefined") {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.removeUserProperty"
      );
    }

    const options = {
      ...this.defaultOptions,
      body: new URLSearchParams({
        data: JSON.stringify({
          $unset: properties,
          distinct_id: this.distinctId,
          token: this.token,
        }),
      }),
    };

    return fetch("https://api.mixpanel.com/engage#profile-unset", options);
  }
}
