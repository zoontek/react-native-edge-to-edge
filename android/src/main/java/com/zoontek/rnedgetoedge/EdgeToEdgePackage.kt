package com.zoontek.rnedgetoedge

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class EdgeToEdgePackage : TurboReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      EdgeToEdgeModuleImpl.NAME -> EdgeToEdgeModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

      val moduleInfo = ReactModuleInfo(
        EdgeToEdgeModuleImpl.NAME,
        EdgeToEdgeModuleImpl.NAME,
        false,
        true,
        true,
        false,
        isTurboModule
      )

      moduleInfos[EdgeToEdgeModuleImpl.NAME] = moduleInfo
      moduleInfos
    }
  }
}
