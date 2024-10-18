package com.zoontek.rnedgetoedge

import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = RNEdgeToEdgeModuleImpl.NAME)
class RNEdgeToEdgeModule(reactContext: ReactApplicationContext?) :
  NativeRNEdgeToEdgeSpec(reactContext), LifecycleEventListener {

  init {
    reactApplicationContext.addLifecycleEventListener(this)
  }

  override fun invalidate() {
    reactApplicationContext.removeLifecycleEventListener(this)
  }

  override fun getName(): String {
    return RNEdgeToEdgeModuleImpl.NAME
  }

  override fun onHostResume() {
    RNEdgeToEdgeModuleImpl.onHostResume(reactApplicationContext)
  }

  override fun onHostPause() {}

  override fun onHostDestroy() {
    RNEdgeToEdgeModuleImpl.onHostDestroy()
  }

  override fun setSystemBarsConfig(config: ReadableMap) {
    RNEdgeToEdgeModuleImpl.setSystemBarsConfig(currentActivity, config)
  }
}
