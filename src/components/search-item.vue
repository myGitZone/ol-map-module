<template>
  <div class="item-container">
    <div class="item-name">
      <span class="icon">
        <slot></slot>
      </span>
      <span :title="name">{{name}}</span>
    </div>
    <div class="item-desc" :title="desc">{{desc}}</div>
  </div>
</template>
<script>
  export default {
    props: {
      data: {
        type: Object,
        default: function () {
          return {
            title: '',
            address: ''
          }
        }
      }
    },
    computed: {
      name() {
        return this.data.title
      },
      desc() {
        return this.data.address
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../map-module/scss/variable";

  .item-container {
    position: relative;
    width: 100%;
    padding: 6px 0;
    height: 70px;
    color: $color-search-item;
    cursor: pointer;
    font-size: 12px;
    &:hover {
      background-color: #003d6f;
    }
    .item-name {
      padding-left: 35px;
      height: 35px;
      line-height: 35px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .icon {
        position: absolute;
        height: 35px;
        width: 30px;
        left: 0;
        text-align: center;
      }
    }
    .item-desc {
      padding-left: 35px;
      height: 35px;
      line-height: 35px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
