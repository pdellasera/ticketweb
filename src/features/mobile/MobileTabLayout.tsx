import { Outlet } from 'react-router-dom'

import { BottomTabNavigator } from './BottomTabNavigator'

export default function MobileTabLayout() {
  return (
    <div className="w-full bg-[#dfe6f0]">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-mobile-bg">
        <div className="flex-1">
          <Outlet />
        </div>
        <div style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
          <BottomTabNavigator />
        </div>
      </div>
    </div>
  )
}

