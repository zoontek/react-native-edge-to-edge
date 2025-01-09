package com.zoontek.rnedgetoedge

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class EdgeToEdgePackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return when (name) {
      EdgeToEdgeModuleImpl.NAME -> EdgeToEdgeModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfo = ReactModuleInfo(
        EdgeToEdgeModuleImpl.NAME,
        EdgeToEdgeModuleImpl.NAME,
        canOverrideExistingModule = false,
        needsEagerInit = true,
        hasConstants = true,
        isCxxModule = false,
        isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      )

      mapOf(
        EdgeToEdgeModuleImpl.NAME to moduleInfo
      )
    }
  }
}
