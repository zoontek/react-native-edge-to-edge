package com.zoontek.rnedgetoedge

import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNEdgeToEdgeModuleImpl.NAME)
class RNEdgeToEdgeModule(reactContext: ReactApplicationContext?) :
  ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

  init {
    reactApplicationContext.addLifecycleEventListener(this)
  }

  override fun getName(): String {
    return RNEdgeToEdgeModuleImpl.NAME
  }

  override fun onHostResume() {
    RNEdgeToEdgeModuleImpl.onHostResume(currentActivity)
  }

  override fun onHostPause() {}

  override fun onHostDestroy() {
    RNEdgeToEdgeModuleImpl.onHostDestroy()
  }

  @ReactMethod
  fun setSystemBarsConfig(config: ReadableMap) {
    RNEdgeToEdgeModuleImpl.setSystemBarsConfig(currentActivity, config)
  }
}
