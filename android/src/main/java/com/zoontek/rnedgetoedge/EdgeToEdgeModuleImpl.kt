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
import com.facebook.react.common.ReactConstants

internal val LightNavigationBarColor = Color.argb(0xe6, 0xFF, 0xFF, 0xFF)
internal val DarkNavigationBarColor = Color.argb(0x80, 0x1b, 0x1b, 0x1b)

object EdgeToEdgeModuleImpl {
  const val NAME = "RNEdgeToEdge"

  private const val NO_ACTIVITY_ERROR = "$NAME: Ignored system bars change, current activity is null."
  private val boolAttributes = mutableMapOf<Int, Boolean>()

  private var statusBarHidden = false
  private var navigationBarHidden = false

  private fun resolveBoolAttribute(activity: Activity, resId: Int): Boolean =
    boolAttributes.getOrPut(resId) {
      val value = TypedValue()
      activity.theme.resolveAttribute(resId, value, true) && value.data != 0
    }

  private fun isDefaultLightSystemBars(activity: Activity): Boolean =
    resolveBoolAttribute(activity, R.attr.enforceSystemBarsLightTheme) ||
      activity.window.decorView.resources.configuration.uiMode and
        Configuration.UI_MODE_NIGHT_MASK != Configuration.UI_MODE_NIGHT_YES

  private fun isNavigationBarTransparent(activity: Activity): Boolean =
    !resolveBoolAttribute(activity, R.attr.enforceNavigationBarContrast)

  @Suppress("DEPRECATION")
  fun applyEdgeToEdge(reactContext: ReactApplicationContext?) {
    val activity = reactContext?.currentActivity
      ?: return FLog.w(ReactConstants.TAG, "$NAME: Ignored, current activity is null.")

    activity.runOnUiThread {
      val window = activity.window
      val insetsController = WindowInsetsControllerCompat(window, window.decorView)

      WindowCompat.setDecorFitsSystemWindows(window, false)

      window.statusBarColor = Color.TRANSPARENT

      if (VERSION.SDK_INT >= VERSION_CODES.O_MR1 && isNavigationBarTransparent(activity)) {
        window.navigationBarColor = Color.TRANSPARENT

        if (VERSION.SDK_INT >= VERSION_CODES.Q) {
          window.isStatusBarContrastEnforced = false
          window.isNavigationBarContrastEnforced = false
        }
      } else {
        val light = isDefaultLightSystemBars(activity)

        window.navigationBarColor = when {
          VERSION.SDK_INT >= VERSION_CODES.Q -> Color.TRANSPARENT
          VERSION.SDK_INT >= VERSION_CODES.O_MR1 && light -> LightNavigationBarColor
          else -> DarkNavigationBarColor
        }

        insetsController.run {
          isAppearanceLightNavigationBars = when {
            VERSION.SDK_INT >= VERSION_CODES.O_MR1 -> light
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

      // re-apply statusBarHidden / navigationBarHidden when app gains focus
      // see https://github.com/zoontek/react-native-edge-to-edge/issues/66
      if (statusBarHidden || navigationBarHidden) {
        insetsController.systemBarsBehavior =
          WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

        if (statusBarHidden) {
          insetsController.hide(WindowInsetsCompat.Type.statusBars())
        }
        if (navigationBarHidden) {
          insetsController.hide(WindowInsetsCompat.Type.navigationBars())
        }
      }
    }
  }

  fun setStatusBarStyle(reactContext: ReactApplicationContext?, style: String) {
    val activity = reactContext?.currentActivity
      ?: return FLog.w(ReactConstants.TAG, NO_ACTIVITY_ERROR)

    activity.runOnUiThread {
      val window = activity.window
      val insetsController = WindowInsetsControllerCompat(window, window.decorView)

      insetsController.isAppearanceLightStatusBars = when (style) {
        "dark-content" -> true
        "light-content" -> false
        else -> isDefaultLightSystemBars(activity)
      }
    }
  }

  fun setNavigationBarStyle(reactContext: ReactApplicationContext?, style: String) {
    val activity = reactContext?.currentActivity
      ?: return FLog.w(ReactConstants.TAG, NO_ACTIVITY_ERROR)

    if (VERSION.SDK_INT >= VERSION_CODES.O_MR1 && isNavigationBarTransparent(activity)) {
      activity.runOnUiThread {
        val window = activity.window
        val insetsController = WindowInsetsControllerCompat(window, window.decorView)

        insetsController.isAppearanceLightNavigationBars = when (style) {
          "dark-content" -> true
          "light-content" -> false
          else -> isDefaultLightSystemBars(activity)
        }
      }
    }
  }

  fun setStatusBarHidden(reactContext: ReactApplicationContext?, hidden: Boolean) {
    val activity = reactContext?.currentActivity
      ?: return FLog.w(ReactConstants.TAG, NO_ACTIVITY_ERROR)

    statusBarHidden = hidden

    activity.runOnUiThread {
      val window = activity.window
      val insetsController = WindowInsetsControllerCompat(window, window.decorView)

      insetsController.systemBarsBehavior =
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

      when (hidden) {
        true -> insetsController.hide(WindowInsetsCompat.Type.statusBars())
        else -> insetsController.show(WindowInsetsCompat.Type.statusBars())
      }
    }
  }

  fun setNavigationBarHidden(reactContext: ReactApplicationContext?, hidden: Boolean) {
    val activity = reactContext?.currentActivity
      ?: return FLog.w(ReactConstants.TAG, NO_ACTIVITY_ERROR)

    navigationBarHidden = hidden

    activity.runOnUiThread {
      val window = activity.window
      val insetsController = WindowInsetsControllerCompat(window, window.decorView)

      insetsController.systemBarsBehavior =
        WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

      when (hidden) {
        true -> insetsController.hide(WindowInsetsCompat.Type.navigationBars())
        else -> insetsController.show(WindowInsetsCompat.Type.navigationBars())
      }
    }
  }
}
