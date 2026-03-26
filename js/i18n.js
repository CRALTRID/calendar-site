export const i18n = {
  zh: {
    pageTitle: "个人挑战日历",
    pageDesc: "这是拆分文件后的基础版本。",
    gateText: "请先登录后继续。",
    gateChecking: "正在检查登录状态…",
    loginBtn: "使用 Google 登录",
    logoutBtn: "退出登录",
    monthView: "月视图",
    yearView: "年视图",
    prev: "上一个",
    today: "今天",
    next: "下一个",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  },
  en: {
    pageTitle: "Personal Challenge Calendar",
    pageDesc: "This is the split-files base version.",
    gateText: "Please sign in to continue.",
    gateChecking: "Checking sign-in status…",
    loginBtn: "Continue with Google",
    logoutBtn: "Sign out",
    monthView: "Month View",
    yearView: "Year View",
    prev: "Previous",
    today: "Today",
    next: "Next",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  }
};

export function t(lang, key) {
  return i18n[lang]?.[key] ?? key;
}