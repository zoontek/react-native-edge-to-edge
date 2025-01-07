package com.zoontek.rnedgetoedge

import android.os.Build.VERSION
import android.os.Build.VERSION_CODES

import android.app.Activity
import android.content.res.Configuration
import android.graphics.Color
import android.util.TypedValue
import android.view.WindowManager

import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

import com.facebook.common.logging.FLog
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.ReactConstants

internal val LightNavigationBarColor = Color.argb(0xe6, 0xFF, 0xFF, 0xFF)
internal val DarkNavigationBarColor = Color.argb(0x80, 0x1b, 0x1b, 0x1b)

object EdgeToEdgeModuleImpl {
  const val NAME = "RNEdgeToEdge"

  private val boolAttributes = mutableMapOf<Int, Boolean>()

  private fun resolveBoolAttribute(activity: Activity, resId: Int): Boolean =
    boolAttributes.getOrPut(resId) {
      val value = TypedValue()
      activity.theme.resolveAttribute(resId, value, true) && value.data != 0
    }

  private fun isNavigationBarLight(activity: Activity): Boolean =
    resolveBoolAttribute(activity, R.attr.enforceNavigationBarLight) ||
      activity.window.decorView.resources.configuration.uiMode and
        Configuration.UI_MODE_NIGHT_MASK != Configuration.UI_MODE_NIGHT_YES

  private fun isNavigationBarTransparent(activity: Activity): Boolean =
    !resolveBoolAttribute(activity, R.attr.enforceNavigationBarContrast)

  @Suppress("DEPRECATION")
  fun applyEdgeToEdge(reactContext: ReactApplicationContext) {
    val activity = reactContext.currentActivity
      ?: return FLog.w(ReactConstants.TAG, "$NAME: Ignored, current activity is null.")

    activity.runOnUiThread {
      val window = activity.window
      val view = window.decorView

      WindowCompat.setDecorFitsSystemWindows(window, false)

      window.statusBarColor = Color.TRANSPARENT

      if (VERSION.SDK_INT >= VERSION_CODES.O_MR1 && isNavigationBarTransparent(activity)) {
        window.navigationBarColor = Color.TRANSPARENT

        if (VERSION.SDK_INT >= VERSION_CODES.Q) {
          window.isStatusBarContrastEnforced = false
          window.isNavigationBarContrastEnforced = false
        }
      } else {
        val isLight = isNavigationBarLight(activity)

        window.navigationBarColor = when {
          VERSION.SDK_INT >= VERSION_CODES.Q -> Color.TRANSPARENT
          VERSION.SDK_INT >= VERSION_CODES.O_MR1 && isLight -> LightNavigationBarColor
          else -> DarkNavigationBarColor
        }

        WindowInsetsControllerCompat(window, view).run {
          isAppearanceLightNavigationBars = when {
            VERSION.SDK_INT >= VERSION_CODES.O_MR1 -> isLight
            else -> false
          }
        }

        if (VERSION.SDK_INT >= VERSION_CODES.Q) {
          window.isStatusBarContrastEnforced = false
          window.isNavigationBarContrastEnforced = true
        }
      }

      if (VERSION.SDK_INT >= VERSION_CODES.P) {
        window.attributes.layoutInDisplayCutoutMode = when {
          VERSION.SDK_INT >= VERSION_CODES.R -> WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
          else -> WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
        }
      }
    }
  }

  fun setSystemBarsConfig(reactContext: ReactApplicationContext, config: ReadableMap) {
    val activity = reactContext.currentActivity
      ?: return FLog.w(ReactConstants.TAG, "$NAME: Ignored, current activity is null.")

    val statusBarHidden =
      config.takeIf { it.hasKey("statusBarHidden") }?.getBoolean("statusBarHidden")
    val statusBarStyle =
      config.takeIf { it.hasKey("statusBarStyle") }?.getString("statusBarStyle")
    val navigationBarHidden =
      config.takeIf { it.hasKey("navigationBarHidden") }?.getBoolean("navigationBarHidden")
    val navigationBarStyle =
      config.takeIf { it.hasKey("navigationBarStyle") }?.getString("navigationBarStyle")

    activity.runOnUiThread {
      val window = activity.window
      val insetsController = WindowInsetsControllerCompat(window, window.decorView)

      statusBarStyle?.let {
        insetsController.isAppearanceLightStatusBars = it == "dark"
      }

      if (VERSION.SDK_INT >= VERSION_CODES.O_MR1 && isNavigationBarTransparent(activity)) {
        navigationBarStyle?.let {
          insetsController.isAppearanceLightNavigationBars = it == "dark"
        }
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
