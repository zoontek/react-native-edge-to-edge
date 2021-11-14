package com.zoontek.rnbars;

import android.app.Activity;

import androidx.annotation.NonNull;

public class RNBars {

  public static void init(@NonNull final Activity activity, @NonNull final String styles) {
    RNBarsModule.init(activity, styles);
  }
}
