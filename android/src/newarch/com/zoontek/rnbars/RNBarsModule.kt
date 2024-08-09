package com.zoontek.rnbars

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNBarsModuleImpl.NAME)
class RNBarsModule(reactContext: ReactApplicationContext?) :
  NativeRNBarsSpec(reactContext) {

  override fun getName(): String {
    return RNBarsModuleImpl.NAME
  }

  override fun setStatusBarStyle(style: String) {
    RNBarsModuleImpl.setStatusBarStyle(currentActivity, style)
  }

  override fun setNavigationBarStyle(style: String) {
    RNBarsModuleImpl.setNavigationBarStyle(currentActivity, style)
  }
}
