import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
    const app = createSSRApp(App)
    
    app.config.productionTip = false
    app.config.errorHandler = function (err, vm, info) {
        console.error('Vue Error:', err, info)
    }
    
    return {
        app
    }
}
