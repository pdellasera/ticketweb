import { Outlet } from 'react-router-dom'

/** 430px shell for the mobile purchase flow (no bottom tab bar). */
export default function MobileFlowLayout() {
  return (
    <div className="w-full bg-[#dfe6f0]">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-mobile-bg">
        <Outlet />
      </div>
    </div>
  )
}
