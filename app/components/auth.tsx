import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";
import { useEffect } from "react";
import { getClientConfig } from "../config/client";

export function AuthPageCustom() {
  const accessStore = useAccessStore();
  const navigate = useNavigate();
  const resetAccessCode = () => {
    accessStore.update((access) => {
      access.username = "";
      access.password = "";
    });
  }; // Reset access code to empty string

  const confirm = async () => {
    const username = accessStore.username;
    const password = accessStore.password;
    if (!username || !password) return;
    try {
      const result = await (
        await fetch("api/login", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            // 添加其他必要的头部信息
          },
          body: JSON.stringify({ username, password }),
        })
      ).json();
      if (result.token) {
        localStorage.setItem("token", result.token);
        navigate(Path.Home);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.Auth.Login}</div>
      <div className={styles["auth-tips"]}>{Locale.Auth.Tips2}</div>
      <input
        className={styles["auth-input"]}
        type="text"
        placeholder={Locale.Auth.Username}
        value={accessStore.username}
        onChange={(e) => {
          accessStore.update(
            (access) => (access.username = e.currentTarget.value),
          );
        }}
      />
      <input
        className={styles["auth-input"]}
        type="password"
        placeholder={Locale.Auth.Password}
        value={accessStore.password}
        onChange={(e) => {
          accessStore.update(
            (access) => (access.password = e.currentTarget.value),
          );
        }}
      />

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Auth.Confirm}
          type="primary"
          onClick={confirm}
        />
        <IconButton
          text={Locale.Auth.Clear}
          onClick={() => {
            resetAccessCode();
          }}
        />
      </div>
    </div>
  );
}
