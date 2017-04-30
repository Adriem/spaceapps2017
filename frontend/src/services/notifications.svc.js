angular.module('EarthTionary').factory('notificationFactory', [
  'Notification',
  function (Notification) {

    function showNotification (msg, delay, type) {
      Notification[type]({
        message: msg,
        delay: delay
      })
    }

    return {
      clear: function () {
        Notification.clearAll()
      },
      success: function (msg, delay) {
        showNotification(msg, delay || 5000, 'success')
      },
      error: function (msg, delay) {
        showNotification(msg, delay || 5000, 'error')
      },
      info: function (msg, delay) {
        showNotification(msg, delay || 5000, 'info')
      }
    }

  }
])
