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
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.common.ReactConstants;
import com.facebook.react.module.annotations.ReactModule;

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

  static public void init(@Nullable final Activity activity, @NonNull final String styles) {
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
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
          window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
          window.addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);

          window.setStatusBarColor(Color.TRANSPARENT);

          insetsController.setAppearanceLightStatusBars("dark-content".equals(styles));
        } else {
          window.addFlags(
            WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS |
              WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
          );
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

  @ReactMethod
  public void setNavigationBarStyle(@Nullable final String style) {
    final Activity activity = getCurrentActivity();

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
