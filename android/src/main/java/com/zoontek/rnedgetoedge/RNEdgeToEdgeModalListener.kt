package com.zoontek.rnedgetoedge

import android.app.Dialog

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcherListener
import com.facebook.react.views.modal.ReactModalHostView

class RNEdgeToEdgeModalListener(
  reactContext: ReactApplicationContext,
  private val onShow: (dialog: Dialog) -> Unit,
  private val onDismiss: (dialog: Dialog) -> Unit
): EventDispatcherListener {

  companion object {
    // https://github.com/facebook/react-native/blob/v0.75.4/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/views/modal/ShowEvent.kt#L28
    const val EVENT_NAME: String = "topShow"
  }

  private val archType = when (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
    true -> UIManagerType.FABRIC
    false -> UIManagerType.DEFAULT
  }

  private val uiManager = UIManagerHelper.getUIManager(reactContext, archType)
  private val dispatcher = UIManagerHelper.getEventDispatcher(reactContext, archType)

  fun enable() {
    dispatcher?.addListener(this)
  }

  fun disable() {
    dispatcher?.removeListener(this)
  }

  override fun onEventDispatch(event: Event<out Event<*>>?) {
    if (event?.eventName == EVENT_NAME) {
      val view = uiManager?.resolveView(event.viewTag) as? ReactModalHostView

      view?.dialog?.let { dialog ->
        onShow(dialog)

        dialog.setOnDismissListener {
          onDismiss(dialog)
          dialog.setOnDismissListener(null)
        }
      }
    }
  }
}
