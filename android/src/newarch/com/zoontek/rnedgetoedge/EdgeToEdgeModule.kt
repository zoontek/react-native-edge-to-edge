package com.zoontek.rnedgetoedge

import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = EdgeToEdgeModuleImpl.NAME)
class EdgeToEdgeModule(reactContext: ReactApplicationContext) :
  NativeEdgeToEdgeModuleSpec(reactContext), LifecycleEventListener {

  init {
    reactApplicationContext.addLifecycleEventListener(this)
  }

  override fun invalidate() {
    reactApplicationContext.removeLifecycleEventListener(this)
  }

  override fun getName(): String {
    return EdgeToEdgeModuleImpl.NAME
  }

  override fun onHostResume() {
    EdgeToEdgeModuleImpl.applyEdgeToEdge(reactApplicationContext)
  }

  override fun onHostPause() {}

  override fun onHostDestroy() {}

  override fun onColorSchemeChange() {
    EdgeToEdgeModuleImpl.applyEdgeToEdge(reactApplicationContext)
  }

  override fun setSystemBarsConfig(config: ReadableMap) {
    EdgeToEdgeModuleImpl.setSystemBarsConfig(reactApplicationContext, config)
  }
}
