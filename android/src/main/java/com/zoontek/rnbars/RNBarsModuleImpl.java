package com.zoontek.rnbars;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.util.TypedValue;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.common.ReactConstants;

public class RNBarsModuleImpl {

  public static final String NAME = "RNBars";

  static public void init(@Nullable final Activity activity) {
    if (activity == null) {
      FLog.w(
        ReactConstants.TAG,
        NAME + ": Ignored initialization, current activity is null.");
      return;
    }

    final Window window = activity.getWindow();
    final View decorView = window.getDecorView();

    final WindowInsetsControllerCompat insetsController =
      new WindowInsetsControllerCompat(window, decorView);

    final TypedValue typedValue = new TypedValue();

    final boolean darkContentBarsStyle = activity
      .getTheme()
      .resolveAttribute(R.attr.darkContentBarsStyle, typedValue, true)
        && typedValue.data != 0;

    WindowCompat.setDecorFitsSystemWindows(window, false);

    activity.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
          window.clearFlags(
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS |
              WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
          );

          window.setStatusBarColor(Color.TRANSPARENT);
          window.setNavigationBarColor(Color.TRANSPARENT);

          insetsController.setAppearanceLightStatusBars(darkContentBarsStyle);
          insetsController.setAppearanceLightNavigationBars(darkContentBarsStyle);

          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setStatusBarContrastEnforced(false);
            window.setNavigationBarContrastEnforced(false);
          }

          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams layoutParams = window.getAttributes();

            layoutParams.layoutInDisplayCutoutMode = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R
              ? WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
              : WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;

            window.setAttributes(layoutParams);
          }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
          window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
          window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

          window.setStatusBarColor(Color.TRANSPARENT);

          insetsController.setAppearanceLightStatusBars(darkContentBarsStyle);
        } else {
          window.addFlags(
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS |
              WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
          );
        }
      }
    });
  }

  public static void setStatusBarStyle(@Nullable final Activity activity,
                                       @NonNull final String style) {
    if (activity == null) {
      FLog.w(
        ReactConstants.TAG,
        NAME + ": Ignored status bar change, current activity is null.");
      return;
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      final Window window = activity.getWindow();
      final View decorView = window.getDecorView();

      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          new WindowInsetsControllerCompat(window, decorView)
            .setAppearanceLightStatusBars("dark".equals(style));
        }
      });
    }
  }

  public static void setNavigationBarStyle(@Nullable final Activity activity,
                                           @NonNull final String style) {
    if (activity == null) {
      FLog.w(
        ReactConstants.TAG,
        NAME + ": Ignored navigation bar change, current activity is null.");
      return;
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      final Window window = activity.getWindow();
      final View decorView = window.getDecorView();

      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          new WindowInsetsControllerCompat(window, decorView)
            .setAppearanceLightNavigationBars("dark".equals(style));
        }
      });
    }
  }
}
