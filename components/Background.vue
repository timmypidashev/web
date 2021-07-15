<template>
  <div>
    <div class="backgroundImage" :style="{ backgroundImage: `url(${backgroundImagePath})` }">
  </div>
</template>

<script>
import backgroundImagePath from '~/assets/background.jpg'
export default {
  data() {
    return { backgroundImagePath }
  }
}
</script>