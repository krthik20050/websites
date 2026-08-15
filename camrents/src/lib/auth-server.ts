import { betterAuth } from "better-auth";
import { authConfig } from "./auth";
import { dash } from "@better-auth/infra";

export const auth = betterAuth({
  ...authConfig,
  plugins: [
    ...authConfig.plugins,
    dash(),
  ],
});

export type Session = typeof auth.$Infer.Session;
