import Vue from 'vue'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import 'vue-snotify/styles/material.css'

const options = {
  toast: {
    position: SnotifyPosition.rightTop,
    titleMaxLength: 150,
    bodyMaxLength: 200,
    timeout: 5000
  }
}

Vue.use(Snotify, options)