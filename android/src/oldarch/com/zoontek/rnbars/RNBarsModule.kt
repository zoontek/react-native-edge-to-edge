package com.zoontek.rnbars

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNBarsModuleImpl.NAME)
class RNBarsModule(reactContext: ReactApplicationContext?) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return RNBarsModuleImpl.NAME
  }

  @ReactMethod
  fun setStatusBarStyle(style: String) {
    RNBarsModuleImpl.setStatusBarStyle(currentActivity, style)
  }

  @ReactMethod
  fun setNavigationBarStyle(style: String) {
    RNBarsModuleImpl.setNavigationBarStyle(currentActivity, style)
  }
}
