<template>
  <view class="forgot-password-container">
    <view class="header">
      <text class="title">重置密码</text>
      <text class="subtitle">请输入您的账号信息进行密码重置</text>
    </view>

    <view class="form-container">
      <view class="form-group">
        <text class="label">用户名</text>
        <input 
          class="input" 
          v-model="form.username" 
          placeholder="请输入用户名"
          :disabled="step !== 1"
        />
      </view>

      <view class="form-group" v-if="step >= 2">
        <text class="label">验证码</text>
        <view class="verify-code-input">
          <input 
            class="input" 
            v-model="form.code" 
            placeholder="请输入验证码"
            :disabled="step !== 2"
          />
          <button 
            class="send-code-btn" 
            :disabled="countdown > 0 || step !== 1" 
            @tap="handleSendCode"
          >
            {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
          </button>
        </view>
      </view>

      <view class="form-group" v-if="step === 3">
        <text class="label">新密码</text>
        <input 
          class="input" 
          v-model="form.password" 
          type="password" 
          placeholder="请输入新密码"
        />
      </view>

      <view class="form-group" v-if="step === 3">
        <text class="label">确认密码</text>
        <input 
          class="input" 
          v-model="form.confirmPassword" 
          type="password" 
          placeholder="请再次输入新密码"
        />
      </view>

      <button class="submit-btn" @tap="handleNextStep">
        {{ step === 3 ? '重置密码' : '下一步' }}
      </button>

      <view class="back-to-login" @tap="goToLogin">
        返回登录
      </view>
    </view>
  </view>
</template>

<script>
import { authApi } from '@/api'

export default {
  data() {
    return {
      step: 1,
      countdown: 0,
      form: {
        username: '',
        code: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    goToLogin() {
      uni.navigateBack()
    },
    startCountdown() {
      this.countdown = 60
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },
    async handleSendCode() {
      if (!this.form.username) {
        uni.showToast({
          title: '请输入用户名',
          icon: 'none'
        })
        return
      }

      try {
        const { data } = await authApi.sendResetCode({
          username: this.form.username
        })

        if (data.code === 200) {
          uni.showToast({
            title: '验证码已发送',
            icon: 'success'
          })
          this.startCountdown()
          this.step = 2
        } else {
          uni.showToast({
            title: data.message || '发送失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '发送失败，请稍后重试',
          icon: 'none'
        })
      }
    },
    async handleNextStep() {
      if (this.step === 1) {
        if (!this.form.username) {
          uni.showToast({
            title: '请输入用户名',
            icon: 'none'
          })
          return
        }
        await this.handleSendCode()
      } else if (this.step === 2) {
        if (!this.form.code) {
          uni.showToast({
            title: '请输入验证码',
            icon: 'none'
          })
          return
        }

        try {
          const { data } = await authApi.verifyResetCode({
            username: this.form.username,
            code: this.form.code
          })

          if (data.code === 200) {
            this.step = 3
          } else {
            uni.showToast({
              title: data.message || '验证码错误',
              icon: 'none'
            })
          }
        } catch (error) {
          uni.showToast({
            title: '验证失败，请稍后重试',
            icon: 'none'
          })
        }
      } else if (this.step === 3) {
        if (!this.form.password) {
          uni.showToast({
            title: '请输入新密码',
            icon: 'none'
          })
          return
        }
        if (!this.form.confirmPassword) {
          uni.showToast({
            title: '请确认新密码',
            icon: 'none'
          })
          return
        }
        if (this.form.password !== this.form.confirmPassword) {
          uni.showToast({
            title: '两次输入的密码不一致',
            icon: 'none'
          })
          return
        }

        try {
          const { data } = await authApi.resetPassword({
            username: this.form.username,
            code: this.form.code,
            password: this.form.password
          })

          if (data.code === 200) {
            uni.showToast({
              title: '密码重置成功',
              icon: 'success'
            })
            setTimeout(() => {
              this.goToLogin()
            }, 1500)
          } else {
            uni.showToast({
              title: data.message || '重置失败',
              icon: 'none'
            })
          }
        } catch (error) {
          uni.showToast({
            title: '重置失败，请稍后重试',
            icon: 'none'
          })
        }
      }
    }
  }
}
</script>

<style>
.forgot-password-container {
  min-height: 100vh;
  padding: 40px 30px;
  background: #f8f9fa;
}

.header {
  margin-bottom: 40px;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.form-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.verify-code-input {
  display: flex;
  gap: 12px;
}

.verify-code-input .input {
  flex: 1;
}

.send-code-btn {
  width: 120px;
  height: 44px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
}

.send-code-btn:disabled {
  background: #ccc;
}

.submit-btn {
  width: 100%;
  height: 44px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  margin-top: 30px;
}

.back-to-login {
  text-align: center;
  margin-top: 20px;
  color: #4CAF50;
  font-size: 14px;
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .forgot-password-container {
    background: #1a1a1a;
  }

  .form-container {
    background: #2d2d2d;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  .title {
    color: #fff;
  }

  .subtitle {
    color: #aaa;
  }

  .label {
    color: #fff;
  }

  .input {
    background: #1e1e1e;
    border-color: #444;
    color: #fff;
  }

  .send-code-btn:disabled {
    background: #444;
    color: #666;
  }
}
</style> 