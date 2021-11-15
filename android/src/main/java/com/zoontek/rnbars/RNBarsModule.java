package com.zoontek.rnbars;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.Window;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.facebook.common.logging.FLog;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.PixelUtil;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = RNBarsModule.NAME)
public class RNBarsModule extends ReactContextBaseJavaModule {

  public static final String NAME = "RNBars";

  public RNBarsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @Nullable
  @Override
  public Map<String, Object> getConstants() {
    final HashMap<String, Object> constants = new HashMap<>();
    final Context context = getReactApplicationContext();
    final boolean hasPermanentMenuKey = ViewConfiguration.get(context).hasPermanentMenuKey();

    final int navigationBarHeightResId =
      context.getResources().getIdentifier("navigation_bar_height", "dimen", "android");

    final float navigationBarHeight =
      navigationBarHeightResId > 0 && !hasPermanentMenuKey
        ? PixelUtil.toDIPFromPixel(context.getResources().getDimensionPixelSize(navigationBarHeightResId))
        : 0;

    constants.put("navigationBarHeight", navigationBarHeight);
    return constants;
  }

  static public void init(@Nullable final Activity activity, @NonNull final String styles) {
    if (activity == null) {
      FLog.w(
        ReactConstants.TAG,
        NAME + ": Ignored initialization, current activity is null.");
      return;
    }

    final Window window = activity.getWindow();
    final View decorView = window.getDecorView();

    WindowCompat.setDecorFitsSystemWindows(window, false);
    WindowInsetsControllerCompat insetsController =
      new WindowInsetsControllerCompat(window, decorView);

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

          insetsController.setAppearanceLightStatusBars("dark-content".equals(styles));
          insetsController.setAppearanceLightNavigationBars("dark-content".equals(styles));

          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setStatusBarContrastEnforced(false);
            window.setNavigationBarContrastEnforced(false);
          }
        } else {
          window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
          window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

          window.setStatusBarColor(Color.TRANSPARENT);

          insetsController.setAppearanceLightStatusBars("dark-content".equals(styles));
        }
      }
    });
  }

  @ReactMethod
  public void setStatusBarStyle(@Nullable final String style) {
    final Activity activity = getCurrentActivity();

    if (activity == null) {
      FLog.w(
        ReactConstants.TAG,
        NAME + ": Ignored status bar change, current activity is null.");
      return;
    }

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

  @ReactMethod
  public void setNavigationBarStyle(@Nullable final String style) {
    final Activity activity = getCurrentActivity();

    if (activity == null) {
      FLog.w(
        ReactConstants.TAG,
        NAME + ": Ignored navigation bar change, current activity is null.");
      return;
    }

    final Window window = activity.getWindow();
    final View decorView = window.getDecorView();

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
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
