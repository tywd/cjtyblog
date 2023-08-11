<template>
  <div class="container">
    <div class="header">
      示例：
      <a class="link" :href="url" target="_blank">
        ❐ 查看
      </a>
    </div>
    <iframe class="content" frameborder="0" :src="url"></iframe>
  </div>
</template>
<script>
export default {
  name: 'PagePreview',
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  .header {
    font-weight: bold;
    margin-bottom: 1rem;
    .link {
      float: right;
      text-decoration: none;
      font-size: 0.9rem;
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
  .content {
    flex-grow: 1;
  }
}
</style>