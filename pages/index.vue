<template>
  <div class="container">
    <div>
      <Background />
      <h1 class="title">
        Timothy Pidashev
      </h1>
      <h2 class="subtitle">
        A 16-year-old on an epic journey to become a software developer! 
      </h2>
      <div class="links">
        <a
          href="https://github.com/timothypidashev"
          target="_blank"
          rel="noopener"
          class="button--green"
        >
          Github
        </a>
        <a
          href="https://discord.gg/34RqygKbtX"
          target="_blank"
          rel="noopener"
          class="button--grey"
        >
          Discord
        </a>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links {
  padding-top: 15px;
}
</style>