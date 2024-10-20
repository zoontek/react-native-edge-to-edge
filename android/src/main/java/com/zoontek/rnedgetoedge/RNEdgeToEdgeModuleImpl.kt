package com.zoontek.rnedgetoedge

import android.app.Activity
import android.content.res.Configuration
import android.graphics.Color
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.view.Window
import android.view.WindowManager

import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

import com.facebook.common.logging.FLog
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.common.ReactConstants

object RNEdgeToEdgeModuleImpl {
  const val NAME = "RNEdgeToEdge"

  private var modalListener: RNEdgeToEdgeModalListener? = null

  private fun applyEdgeToEdge(window: Window?) {
    if (window == null) {
      return FLog.w(ReactConstants.TAG, "$NAME: Ignored, window is null.")
    }

    val view = window.decorView

    UiThreadUtil.runOnUiThread {
      WindowCompat.setDecorFitsSystemWindows(window, false)

      window.statusBarColor = Color.TRANSPARENT
      window.navigationBarColor = ContextCompat.getColor(view.context, R.color.navigationBarColor)

      val isDarkMode =
        view.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK ==
          Configuration.UI_MODE_NIGHT_YES

      WindowInsetsControllerCompat(window, view).run {
        isAppearanceLightNavigationBars = !isDarkMode
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        window.isStatusBarContrastEnforced = false
        window.isNavigationBarContrastEnforced = true
      }

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        window.attributes.layoutInDisplayCutoutMode = when {
          Build.VERSION.SDK_INT >= Build.VERSION_CODES.R -> WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
          else -> WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
        }
      }
    }
  }

  fun onHostResume(reactContext: ReactApplicationContext) {
    val activity = reactContext.currentActivity
      ?: return FLog.w(ReactConstants.TAG, "$NAME: Ignored, current activity is null.")

    applyEdgeToEdge(activity.window)

    if (modalListener == null) {
      modalListener = RNEdgeToEdgeModalListener(reactContext, { dialog -> applyEdgeToEdge(dialog.window) }, {})
      modalListener?.enable()
    }
  }

  fun onHostDestroy() {
    modalListener?.disable()
    modalListener = null
  }

  fun onConfigChange(reactContext: ReactApplicationContext) {
    Handler(Looper.getMainLooper()).postDelayed({
      applyEdgeToEdge(reactContext.currentActivity?.window)
    }, 100)
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
