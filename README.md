# No persistence mixpanel

Minimal Mixpanel API for usage in environments where cookies/localStorage are either not supported (e.g., Figma Plugins), or where you don't want/need them (e.g., to avoid needing a cookie banner).

This library wraps Mixpanel's HTTP API instead, which requires you to maintain the user's `distinct_id` property yourself.

In the case of figma, the library provides helper methods to do this automatically for you.

## Installation

### NPM

```bash
npm install no-persistence-mixpanel
```

### Yarn

```bash
yarn add no-persistence-mixpanel
```

## Usage

To use the Mixpanel api directly:

```ts
import Mixpanel from "no-persistence-mixpanel";

const mixpanel = new Mixpanel(/* Your Project Token */);
mixpanel.identify(user.id);
mixpanel.track("Page Viewed");
```

### Figma Plugin

If you're using this package for a Figma plugin, the library provides additional helper methods to manage the user's identity.

Note, it assumes you're using a bundler such as Webpack.

```ts
/**
 * code.ts
 */
import { setupIdentification } from "no-persistence-mixpanel/figma-code";
setupIndentifcation();

/**
 * ui.ts
 */
import { initialise } from "no-persistence-mixpanel/figma-ui";
initialise(/* Your project token */, (mixpanel) => {
  mixpanel.track("Plugin Opened");
});
```
