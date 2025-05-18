<!-- 课程评论组件 -->
<template>
  <div class="course-comments">
    <h3 class="comments-title">课程评论</h3>
    
    <!-- 评论输入框 -->
    <div class="comment-input">
      <textarea
        v-model="newComment"
        placeholder="写下你的想法..."
        :rows="3"
        class="comment-textarea"
      ></textarea>
      <div class="comment-actions">
        <span class="char-count">{{ newComment.length }}/500</span>
        <button
          @click="submitComment"
          :disabled="!newComment.trim() || newComment.length > 500"
          class="submit-btn"
        >
          发表评论
        </button>
      </div>
    </div>
    
    <!-- 评论列表 -->
    <div class="comments-list">
      <div v-for="comment in sortedComments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <img :src="comment.avatar" alt="用户头像" class="user-avatar" />
          <div class="comment-info">
            <span class="username">{{ comment.username }}</span>
            <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
          </div>
        </div>
        
        <div class="comment-content">{{ comment.content }}</div>
        
        <div class="comment-footer">
          <button class="action-btn" @click="toggleLike(comment)">
            <i class="icon-like" :class="{ active: comment.liked }"></i>
            {{ comment.likes }}
          </button>
          <button class="action-btn" @click="toggleReply(comment)">
            <i class="icon-reply"></i>
            回复
          </button>
        </div>
        
        <!-- 回复列表 -->
        <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
          <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
            <div class="comment-header">
              <img :src="reply.avatar" alt="用户头像" class="user-avatar small" />
              <div class="comment-info">
                <span class="username">{{ reply.username }}</span>
                <span class="comment-time">{{ formatTime(reply.timestamp) }}</span>
              </div>
            </div>
            <div class="reply-content">{{ reply.content }}</div>
          </div>
        </div>
        
        <!-- 回复输入框 -->
        <div v-if="comment.showReply" class="reply-input">
          <textarea
            v-model="comment.replyContent"
            placeholder="回复评论..."
            :rows="2"
            class="comment-textarea"
          ></textarea>
          <div class="comment-actions">
            <button
              @click="submitReply(comment)"
              :disabled="!comment.replyContent || comment.replyContent.length > 200"
              class="submit-btn small"
            >
              回复
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseComments',
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      newComment: '',
      comments: [
        {
          id: '1',
          username: '张三',
          avatar: 'https://example.com/avatar1.jpg',
          content: '这门课程讲得很清楚，特别是实践部分很有帮助！',
          timestamp: Date.now() - 3600000,
          likes: 12,
          liked: false,
          replies: [
            {
              id: '1-1',
              username: '李四',
              avatar: 'https://example.com/avatar2.jpg',
              content: '同意，我也觉得实践部分做得很好',
              timestamp: Date.now() - 1800000
            }
          ],
          showReply: false,
          replyContent: ''
        }
      ]
    }
  },
  computed: {
    sortedComments() {
      return [...this.comments].sort((a, b) => b.timestamp - a.timestamp)
    }
  },
  methods: {
    formatTime(timestamp) {
      const now = Date.now()
      const diff = now - timestamp
      
      if (diff < 60000) { // 小于1分钟
        return '刚刚'
      } else if (diff < 3600000) { // 小于1小时
        return `${Math.floor(diff / 60000)}分钟前`
      } else if (diff < 86400000) { // 小于24小时
        return `${Math.floor(diff / 3600000)}小时前`
      } else {
        const date = new Date(timestamp)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      }
    },
    
    submitComment() {
      if (!this.newComment.trim() || this.newComment.length > 500) return
      
      const comment = {
        id: Date.now().toString(),
        username: '当前用户', // 实际应用中从用户系统获取
        avatar: 'https://example.com/avatar.jpg',
        content: this.newComment,
        timestamp: Date.now(),
        likes: 0,
        liked: false,
        replies: [],
        showReply: false,
        replyContent: ''
      }
      
      this.comments.unshift(comment)
      this.newComment = ''
      
      // 触发事件通知父组件
      this.$emit('comment-added', comment)
    },
    
    toggleLike(comment) {
      comment.liked = !comment.liked
      comment.likes += comment.liked ? 1 : -1
    },
    
    toggleReply(comment) {
      comment.showReply = !comment.showReply
      if (!comment.showReply) {
        comment.replyContent = ''
      }
    },
    
    submitReply(comment) {
      if (!comment.replyContent || comment.replyContent.length > 200) return
      
      const reply = {
        id: `${comment.id}-${Date.now()}`,
        username: '当前用户', // 实际应用中从用户系统获取
        avatar: 'https://example.com/avatar.jpg',
        content: comment.replyContent,
        timestamp: Date.now()
      }
      
      if (!comment.replies) {
        comment.replies = []
      }
      comment.replies.push(reply)
      comment.showReply = false
      comment.replyContent = ''
      
      // 触发事件通知父组件
      this.$emit('reply-added', { commentId: comment.id, reply })
    }
  }
}
</script>

<style>
.course-comments {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comments-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.comment-input {
  margin-bottom: 30px;
}

.comment-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
  transition: border-color 0.3s;
}

.comment-textarea:focus {
  border-color: #4CAF50;
  outline: none;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.char-count {
  color: #999;
  font-size: 14px;
}

.submit-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background: #45a049;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.submit-btn.small {
  padding: 6px 12px;
  font-size: 14px;
}

.comment-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.user-avatar.small {
  width: 30px;
  height: 30px;
}

.comment-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  color: #333;
}

.comment-time {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 10px 0;
}

.comment-footer {
  display: flex;
  gap: 20px;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.action-btn:hover {
  background: #f5f5f5;
}

.icon-like, .icon-reply {
  font-size: 16px;
}

.icon-like.active {
  color: #4CAF50;
}

.replies-list {
  margin-left: 52px;
  margin-top: 10px;
}

.reply-item {
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-content {
  font-size: 14px;
  color: #333;
  margin: 5px 0;
}

.reply-input {
  margin-left: 52px;
  margin-top: 10px;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .course-comments {
    background: #1e1e1e;
  }
  
  .comments-title {
    color: #fff;
  }
  
  .comment-textarea {
    background: #2d2d2d;
    border-color: #3d3d3d;
    color: #fff;
  }
  
  .comment-textarea:focus {
    border-color: #4CAF50;
  }
  
  .username {
    color: #fff;
  }
  
  .comment-content,
  .reply-content {
    color: #ddd;
  }
  
  .action-btn {
    color: #999;
  }
  
  .action-btn:hover {
    background: #2d2d2d;
  }
  
  .comment-item {
    border-bottom-color: #3d3d3d;
  }
  
  .reply-item {
    border-bottom-color: #2d2d2d;
  }
}
</style> 