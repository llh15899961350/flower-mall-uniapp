
export interface NavbarInfo {
  statusBarHeight: number  // 状态栏高度
  navBarHeight: number     // 导航栏总高度
  menuHeight: number       // 胶囊高度
  menuTop: number          // 胶囊顶部距离屏幕顶部
}

export const useNavBar = (): NavbarInfo => {
  const windowInfo: UniNamespace.GetWindowInfoResult = uni.getWindowInfo()
  const menuButton: UniNamespace.GetMenuButtonBoundingClientRectRes = uni.getMenuButtonBoundingClientRect()

  const statusBarHeight: number = windowInfo.statusBarHeight || 0

  const navBarHeight: number =
    (menuButton.top - statusBarHeight) * 2 + menuButton.height

  return {
    statusBarHeight,
    navBarHeight,
    menuHeight: menuButton.height,
    menuTop: menuButton.top
  }
}

