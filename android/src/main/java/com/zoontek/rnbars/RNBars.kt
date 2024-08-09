package com.zoontek.rnbars

import android.app.Activity

object RNBars {
  fun init(activity: Activity) {
    RNBarsModuleImpl.init(activity)
  }
}
