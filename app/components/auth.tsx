import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";
import { useEffect } from "react";
import { getClientConfig } from "../config/client";
import { showToast } from "./ui-lib";
import { encryptData, genPwd } from "../utils/encoder";

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
      const merge = await encryptData(
        JSON.stringify({ username, password: genPwd(password) }),
        accessStore.rp,
      );
      const result = await (
        await fetch("http://localhost:4000/auth/login", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...merge }),
        })
      ).json();
      if (result.token) {
        localStorage.setItem("token", result.token);
        navigate(Path.Home);
      } else {
        showToast(result.error);
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
        autoComplete="off"
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
