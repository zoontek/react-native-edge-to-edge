package com.zoontek.rnbars;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.OnApplyWindowInsetsListener;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.common.ReactConstants;

public class RNBarsModuleImpl {

  public static final String NAME = "RNBars";

  static public void init(@Nullable final Activity activity,
                          boolean darkContentBarsStyle,
                          boolean enableKeyboardHandling) {
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

    WindowCompat.setDecorFitsSystemWindows(window, false);

    if (enableKeyboardHandling) {
      ViewCompat.setOnApplyWindowInsetsListener(decorView, new OnApplyWindowInsetsListener() {
        @Override
        @NonNull
        public WindowInsetsCompat onApplyWindowInsets(@NonNull View view,
                                                      @NonNull WindowInsetsCompat windowInsets) {
          int paddingBottom = windowInsets.getInsets(WindowInsetsCompat.Type.ime()).bottom;

          if (paddingBottom != view.getPaddingBottom()) {
            int paddingLeft = view.getPaddingLeft();
            int paddingTop = view.getPaddingTop();
            int paddingRight = view.getPaddingRight();

            view.setPadding(paddingLeft, paddingTop, paddingRight, paddingBottom);
          }

          return windowInsets;
        }
      });
    }

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
            .setAppearanceLightStatusBars("dark-content".equals(style));
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
            .setAppearanceLightNavigationBars("dark-content".equals(style));
        }
      });
    }
  }
}
