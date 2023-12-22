package com.zoontek.rnbars;

import android.app.Activity;
import android.util.TypedValue;

import androidx.annotation.NonNull;

public class RNBars {

  private static boolean getDarkContentBarsStyle(@NonNull final Activity activity) {
    TypedValue value = new TypedValue();

    return activity
      .getTheme()
      .resolveAttribute(R.attr.darkContentBarsStyle, value, true) && value.data != 0;
  }

  public static void init(@NonNull final Activity activity,
                          @NonNull final String styles) {
    RNBarsModuleImpl.init(activity, "dark-content".equals(styles), true);
  }

  public static void init(@NonNull final Activity activity,
                          @NonNull final String styles,
                          boolean enableKeyboardHandling) {
    RNBarsModuleImpl.init(activity, "dark-content".equals(styles), enableKeyboardHandling);
  }

  public static void init(@NonNull final Activity activity) {
    RNBarsModuleImpl.init(activity, getDarkContentBarsStyle(activity), true);
  }

  public static void init(@NonNull final Activity activity,
                          boolean enableKeyboardHandling) {
    RNBarsModuleImpl.init(activity, getDarkContentBarsStyle(activity), enableKeyboardHandling);
  }
}
