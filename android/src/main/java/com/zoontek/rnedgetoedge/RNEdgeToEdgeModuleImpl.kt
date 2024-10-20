package com.zoontek.rnedgetoedge

import android.app.Activity
import android.content.res.Configuration
import android.graphics.Color
import android.os.Build
import android.util.TypedValue
import android.view.WindowManager

import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

import com.facebook.common.logging.FLog
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.ReactConstants

object RNEdgeToEdgeModuleImpl {
  const val NAME = "RNEdgeToEdge"

  private var isInitialHostResume = true

  fun onHostResume(reactContext: ReactContext) {
    val activity = reactContext.currentActivity
      ?: return FLog.w(ReactConstants.TAG, "$NAME: Ignored, current activity is null.")

    activity.runOnUiThread {
      val window = activity.window

      WindowCompat.setDecorFitsSystemWindows(window, false)

      window.statusBarColor = Color.TRANSPARENT

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        window.isStatusBarContrastEnforced = false
        window.isNavigationBarContrastEnforced = true
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        window.attributes.layoutInDisplayCutoutMode = when {
          Build.VERSION.SDK_INT >= Build.VERSION_CODES.R ->
            WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
          else -> WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
        }
      }

      if (isInitialHostResume) {
        isInitialHostResume = false

        val view = window.decorView
        val context = view.context

        val isDarkMode =
          view.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK ==
            Configuration.UI_MODE_NIGHT_YES

        window.navigationBarColor = ContextCompat.getColor(context, R.color.navigationBarColor)

        WindowInsetsControllerCompat(window, view).run {
          val typedValue = TypedValue()

          val resolved = activity.theme
            .resolveAttribute(android.R.attr.windowLightStatusBar, typedValue, true)

          isAppearanceLightStatusBars = resolved && typedValue.data != 0
          isAppearanceLightNavigationBars = !isDarkMode
        }
      }
    }
  }

  fun onHostDestroy() {
    isInitialHostResume = true
  }

  fun setSystemBarsConfig(activity: Activity?, config: ReadableMap) {
    if (activity == null) {
      return FLog.w(ReactConstants.TAG, "$NAME: Ignored, current activity is null.")
    }

    val statusBarHidden =
      config.takeIf { it.hasKey("statusBarHidden") }?.getBoolean("statusBarHidden")
    val statusBarStyle =
      config.takeIf { it.hasKey("statusBarStyle") }?.getString("statusBarStyle")
    val navigationBarHidden =
      config.takeIf { it.hasKey("navigationBarHidden") }?.getBoolean("navigationBarHidden")

    activity.runOnUiThread {
      val window = activity.window
      val insetsController = WindowInsetsControllerCompat(window, window.decorView)

      statusBarStyle?.let {
        insetsController.isAppearanceLightStatusBars = it == "dark"
      }

      if (statusBarHidden != null || navigationBarHidden != null) {
        insetsController.systemBarsBehavior =
          WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

        statusBarHidden?.let {
          when (it) {
            true -> insetsController.hide(WindowInsetsCompat.Type.statusBars())
            else -> insetsController.show(WindowInsetsCompat.Type.statusBars())
          }
        }
        navigationBarHidden?.let {
          when (it) {
            true -> insetsController.hide(WindowInsetsCompat.Type.navigationBars())
            else -> insetsController.show(WindowInsetsCompat.Type.navigationBars())
          }
        }
      }
    }
  }
}
