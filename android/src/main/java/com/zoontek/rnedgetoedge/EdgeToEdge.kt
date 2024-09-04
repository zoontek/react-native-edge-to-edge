package com.zoontek.rnedgetoedge

import android.app.Activity

object EdgeToEdge {
  fun enable(activity: Activity) {
    RNEdgeToEdgeModuleImpl.enable(activity)
  }
}
