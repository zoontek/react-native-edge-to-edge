package com.zoontek.rnbars

import android.app.Activity
import android.graphics.Color
import android.os.Build
import android.util.TypedValue
import android.view.WindowManager

import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat

import com.facebook.common.logging.FLog
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.common.ReactConstants

object RNBarsModuleImpl {
  const val NAME = "RNBars"

  fun init(activity: Activity?) {
    if (activity == null) {
      return FLog.w(ReactConstants.TAG, "$NAME: Ignored initialization, current activity is null.")
    }

    val typedValue = TypedValue()
    val window = activity.window
    val insetsController = WindowInsetsControllerCompat(window, window.decorView)

    val isAppearanceLightSystemBars = activity
      .theme
      .resolveAttribute(R.attr.darkContentBarsStyle, typedValue, true) &&
      typedValue.data != 0

    WindowCompat.setDecorFitsSystemWindows(window, false)

    activity.runOnUiThread(Runnable {
      window.statusBarColor = Color.TRANSPARENT
      insetsController.isAppearanceLightStatusBars = isAppearanceLightSystemBars

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
        window.navigationBarColor = Color.TRANSPARENT
        insetsController.isAppearanceLightNavigationBars = isAppearanceLightSystemBars

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          window.isStatusBarContrastEnforced = false
          window.isNavigationBarContrastEnforced = false
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
          window.attributes = window.attributes.apply {
            layoutInDisplayCutoutMode = when {
              Build.VERSION.SDK_INT >= Build.VERSION_CODES.R ->
                WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
              else -> WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
            }
          }
        }
      } else {
        // The dark scrim color used in the platform.
        // https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/res/res/color/system_bar_background_semi_transparent.xml
        // https://cs.android.com/android/platform/superproject/+/master:frameworks/base/core/res/remote_color_resources_res/values/colors.xml;l=67
        window.navigationBarColor = Color.argb(0x80, 0x1b, 0x1b, 0x1b)
      }
    })
  }

  fun setStatusBarStyle(activity: Activity?, style: String) {
    if (activity == null) {
      return FLog.w(ReactConstants.TAG, "$NAME: Ignored status bar change, current activity is null.")
    }

    val window = activity.window
    val decorView = window.decorView

    UiThreadUtil.runOnUiThread {
      WindowInsetsControllerCompat(window, decorView).isAppearanceLightStatusBars = "dark" == style
    }
  }

  fun setNavigationBarStyle(activity: Activity?, style: String) {
    if (activity == null) {
      return FLog.w(ReactConstants.TAG, "$NAME: Ignored navigation bar change, current activity is null.")
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      val window = activity.window
      val decorView = window.decorView

      UiThreadUtil.runOnUiThread {
        WindowInsetsControllerCompat(window, decorView).isAppearanceLightNavigationBars = "dark" == style
      }
    }
  }
}
