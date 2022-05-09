import type { Dict } from "mixpanel-browser";

/**
 * Allow usage `application/json` for React Native support.
 */
type ContentType = "application/x-www-form-urlencoded" | "application/json";

interface Options {
  contentType?: ContentType;
}

export default class Mixpanel {
  private token: string;
  private distinctId?: string;
  private readonly options;

  constructor(token: string, options: Options = {}) {
    this.token = token;

    this.options = {
      method: "POST",
      headers: {
        Accept: "text/plain",
        "Content-Type":
          options?.contentType || "application/x-www-form-urlencoded",
      },
    };
  }

  public identify(distinctId: string): void {
    this.distinctId = distinctId;
  }

  /**
   * When maintaining an anonymous id in your code base, you may want to
   * merge the anonymous id with one existing in your database.
   *
   * This is traditional Mixpanel behaviour when calling `mixpanel.identify()`
   */
  public createIdentity(
    distinctId: string,
    anonymousId: string
  ): Promise<Response> {
    if (typeof distinctId === "undefined") {
      throw new Error("Mixpanel: Please supply a new distinctId");
    }

    this.distinctId = distinctId;

    const options = {
      ...this.options,
      body: JSON.stringify([
        {
          event: "$identify",
          properties: {
            distinct_id: this.distinctId,
            $identified_id: this.distinctId,
            $anon_id: anonymousId,
            token: this.token,
          },
        },
      ]),
    };

    return fetch("https://api.mixpanel.com/track#create-identity", options);
  }

  public track(event: string, properties: Dict = {}): Promise<Response> {
    if (typeof this.distinctId === "undefined") {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.track"
      );
    }

    const options = {
      ...this.options,
      body: JSON.stringify([
        {
          event,
          properties: {
            ...properties,
            distinct_id: this.distinctId,
            token: this.token,
          },
        },
      ]),
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
      ...this.options,
      body: JSON.stringify([
        {
          $set: properties,
          distinct_id: this.distinctId,
          token: this.token,
        },
      ]),
    };

    return fetch("https://api.mixpanel.com/engage#profile-set", options);
  }

  public setUserPropertyOnce(properties: Dict): Promise<Response> {
    if (!this.isIdentified()) {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.setUserProperty"
      );
    }

    const options = {
      ...this.options,
      body: JSON.stringify([
        {
          $set_once: properties,
          distinct_id: this.distinctId,
          token: this.token,
        },
      ]),
    };

    return fetch("https://api.mixpanel.com/engage#profile-set-once", options);
  }

  public incrementUserNumericalProperty(
    properties: Record<string, number>
  ): Promise<Response> {
    if (!this.isIdentified()) {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.incrementUserNumbericalProperty"
      );
    }

    const options = {
      ...this.options,
      body: JSON.stringify([
        {
          $add: properties,
          distinct_id: this.distinctId,
          token: this.token,
        },
      ]),
    };

    return fetch(
      "https://api.mixpanel.com/engage#profile-numerical-add",
      options
    );
  }

  public unionUserListProperty(
    properties: Record<string, string[]>
  ): Promise<Response> {
    if (!this.isIdentified()) {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.unionUserListProperty"
      );
    }

    const options = {
      ...this.options,
      body: JSON.stringify([
        {
          $union: properties,
          distinct_id: this.distinctId,
          token: this.token,
        },
      ]),
    };

    return fetch("https://api.mixpanel.com/engage#profile-union", options);
  }

  public appendUserListProperty(
    properties: Record<string, string>
  ): Promise<Response> {
    if (!this.isIdentified()) {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.appendUserListProperty"
      );
    }

    const options = {
      ...this.options,
      body: JSON.stringify([
        {
          $append: properties,
          distinct_id: this.distinctId,
          token: this.token,
        },
      ]),
    };

    return fetch(
      "https://api.mixpanel.com/engage#profile-list-append",
      options
    );
  }

  public removeUserListProperty(
    properties: Record<string, string>
  ): Promise<Response> {
    if (!this.isIdentified()) {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.removeUserListProperty"
      );
    }

    const options = {
      ...this.options,
      body: JSON.stringify([
        {
          $remove: properties,
          distinct_id: this.distinctId,
          token: this.token,
        },
      ]),
    };

    return fetch(
      "https://api.mixpanel.com/engage#profile-list-remove",
      options
    );
  }

  public removeUserProperty(properties: string[]): Promise<Response> {
    if (!this.isIdentified()) {
      throw new Error(
        "Mixpanel: Please call mixpanel.identify before calling mixpanel.removeUserProperty"
      );
    }

    const options = {
      ...this.options,
      body: JSON.stringify([
        {
          $unset: properties,
          distinct_id: this.distinctId,
          token: this.token,
        },
      ]),
    };

    return fetch("https://api.mixpanel.com/engage#profile-unset", options);
  }
}
