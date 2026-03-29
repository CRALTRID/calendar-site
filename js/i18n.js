const dict = {
  en: { login: "Login", logout: "Logout" },
  zh: { login: "登录", logout: "退出" }
};

export function t(lang, key) {
  return dict[lang][key] || key;
}
