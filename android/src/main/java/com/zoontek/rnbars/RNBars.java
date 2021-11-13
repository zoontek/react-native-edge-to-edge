package com.zoontek.rnbars;

import android.app.Activity;

import androidx.annotation.NonNull;

public class RNBars {

  public static void init(@NonNull final Activity activity) {
    RNBarsModule.init(activity);
  }
}
