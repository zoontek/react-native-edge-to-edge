package com.zoontek.rnbars;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = RNBarsModuleImpl.NAME)
public class RNBarsModule extends ReactContextBaseJavaModule {

  public RNBarsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return RNBarsModuleImpl.NAME;
  }

  @ReactMethod
  public void setStatusBarStyle(String style) {
    RNBarsModuleImpl.setStatusBarStyle(getCurrentActivity(), style);
  }

  @ReactMethod
  public void setNavigationBarStyle(String style) {
    RNBarsModuleImpl.setNavigationBarStyle(getCurrentActivity(), style);
  }
}
