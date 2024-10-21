package com.zoontek.rnedgetoedge

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter

import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = EdgeToEdgeModuleImpl.NAME)
class EdgeToEdgeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), LifecycleEventListener {

  private val configChangeReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
      EdgeToEdgeModuleImpl.onConfigChange(reactContext)
    }
  }

  init {
    reactApplicationContext.registerReceiver(configChangeReceiver, IntentFilter(Intent.ACTION_CONFIGURATION_CHANGED))
    reactApplicationContext.addLifecycleEventListener(this)
  }

  override fun invalidate() {
    reactApplicationContext.unregisterReceiver(configChangeReceiver)
    reactApplicationContext.removeLifecycleEventListener(this)
  }

  override fun getName(): String {
    return EdgeToEdgeModuleImpl.NAME
  }

  override fun onHostResume() {
    EdgeToEdgeModuleImpl.onHostResume(reactApplicationContext)
  }

  override fun onHostPause() {}

  override fun onHostDestroy() {}

  @ReactMethod
  fun setSystemBarsConfig(config: ReadableMap) {
    EdgeToEdgeModuleImpl.setSystemBarsConfig(reactApplicationContext, config)
  }
}
