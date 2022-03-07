import { stringify } from "qs";
import type { Dict } from "mixpanel-browser";

interface Options {
  method: "POST";
  headers: {
    Accept: "text/plain" | "application/json";
    "Content-Type": "application/x-www-form-urlencoded" | "application/json";
  };
}

export default class Mixpanel {
  private token: string;
  private distinctId?: string;

  private readonly defaultOptions: Options = {
    method: "POST",
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  private options: Options = this.defaultOptions;

  constructor(token: string, options: Partial<Options>) {
    this.token = token;

    this.options = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers,
      },
    };
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
      ...this.options,
      body: stringify([
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
    if (typeof this.distinctId === "undefined") {
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
    if (typeof this.distinctId === "undefined") {
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
    if (typeof this.distinctId === "undefined") {
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
    if (typeof this.distinctId === "undefined") {
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
    if (typeof this.distinctId === "undefined") {
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
    if (typeof this.distinctId === "undefined") {
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
