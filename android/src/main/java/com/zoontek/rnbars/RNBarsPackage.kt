package com.zoontek.rnbars

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class RNBarsPackage : TurboReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      RNBarsModuleImpl.NAME -> RNBarsModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
      val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED

      val moduleInfo = ReactModuleInfo(
        RNBarsModuleImpl.NAME,
        RNBarsModuleImpl.NAME,
        false,
        false,
        true,
        false,
        isTurboModule
      )

      moduleInfos[RNBarsModuleImpl.NAME] = moduleInfo
      moduleInfos
    }
  }
}
