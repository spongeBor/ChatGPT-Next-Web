import { NextRequest } from "next/server";
import { getServerSideConfig } from "../config/server";
import { ACCESS_CODE_PREFIX, ModelProvider } from "../constant";
import { verifyToken } from "./jwt";

function getIP(req: NextRequest) {
  let ip = req.ip ?? req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "";
  }

  return ip;
}

function parseApiKey(bearToken: string) {
  const token = bearToken.trim().replaceAll("Bearer ", "").trim();
  const isApiKey = !token.startsWith(ACCESS_CODE_PREFIX);

  return {
    jwtToken: isApiKey ? "" : token.slice(ACCESS_CODE_PREFIX.length),
    apiKey: isApiKey ? token : "",
  };
}

export function auth(req: NextRequest, modelProvider: ModelProvider) {
  const authToken = req.headers.get("Authorization") ?? "";

  // check if it is openai api key or user token
  const { jwtToken, apiKey } = parseApiKey(authToken);

  const serverConfig = getServerSideConfig();
  console.log("[Auth] got token:", jwtToken);
  console.log("[User IP] ", getIP(req));
  console.log("[Time] ", new Date().toLocaleString());

  if (!jwtToken && !apiKey) {
    return {
      error: true,
      msg: "you are not login. please login first",
    };
  }

  if (jwtToken) {
    const isValidToken = verifyToken(jwtToken);
    if (!isValidToken) {
      return {
        error: true,
        msg: "you token is timeout, please login again",
      };
    }
  }

  if (serverConfig.hideUserApiKey && !!apiKey) {
    return {
      error: true,
      msg: "you are not allowed to access with your own api key",
    };
  }

  // if user does not provide an api key, inject system api key
  if (!apiKey) {
    const serverConfig = getServerSideConfig();

    const systemApiKey =
      modelProvider === ModelProvider.GeminiPro
        ? serverConfig.googleApiKey
        : serverConfig.isAzure
          ? serverConfig.azureApiKey
          : serverConfig.apiKey;
    if (systemApiKey) {
      console.log("[Auth] use system api key");
      req.headers.set("Authorization", `Bearer ${systemApiKey}`);
    } else {
      console.log("[Auth] admin did not provide an api key");
    }
  } else {
    console.log("[Auth] use user api key");
  }

  return {
    error: false,
  };
}
