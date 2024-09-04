package com.zoontek.rnedgetoedge

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNEdgeToEdgeModuleImpl.NAME)
class RNEdgeToEdgeModule(reactContext: ReactApplicationContext?) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return RNEdgeToEdgeModuleImpl.NAME
  }

  @ReactMethod
  fun setSystemBarsConfig(config: ReadableMap) {
    RNEdgeToEdgeModuleImpl.setSystemBarsConfig(currentActivity, config)
  }
}
