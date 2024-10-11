package com.zoontek.rnedgetoedge

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class RNEdgeToEdgePackage : TurboReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      RNEdgeToEdgeModuleImpl.NAME -> RNEdgeToEdgeModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

      val moduleInfo = ReactModuleInfo(
        RNEdgeToEdgeModuleImpl.NAME,
        RNEdgeToEdgeModuleImpl.NAME,
        false,
        false,
        true,
        false,
        isTurboModule
      )

      moduleInfos[RNEdgeToEdgeModuleImpl.NAME] = moduleInfo
      moduleInfos
    }
  }
}
