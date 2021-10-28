import { rest } from "msw";

export const handlers = [
  rest.post("https://api.mixpanel.com/*", (req, res, ctx) => {
    return res(ctx.json(req.body));
  }),
];
