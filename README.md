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

In order to use them, you'll need to be using a bundler, such as webpack, and give your plugin `currentuser` permissions:

```ts
/**
 * manifest.json
 */
{
  "name": "example",
  "id": "1234",
  "api": "1.0.0",
  "main": "dist/code.js",
  "editorType": ["figma", "figjam"],
  "ui": "dist/ui.html"
  // Required permissions
  "permissions": ["currentuser"],
}

/**
 * code.ts
 */
import { setupIdentification } from "no-persistence-mixpanel/figma-code";
setupIdentification(figma);

/**
 * ui.ts
 */
import { init } from "no-persistence-mixpanel/figma-ui";
init(/* Your project token */, (mixpanel) => {
  mixpanel.track("Plugin Opened");
});
```
