<template>
  <b-jumbotron id="about" bg-variant="white" class="rounded-0 mb-0">
    <b-row>
      <b-col
        md="4"
        order-md="2"
        class="d-flex align-items-center justify-content-center"
      >
        <b-img fluid src="~assets/timmy.jpeg" alt="Timmy" class="img" />
      </b-col>

      <b-col md="8" order-md="1">
        <b-container>
          <h2 class="display-4">Timothy Pidashev</h2>

          <p class="lead">
            A 16-year-old on an epic journey to become a software developer! 
          </p>
        </b-container>
      </b-col>
    </b-row>
  </b-jumbotron>
</template>

<style scoped>
.img {
  max-height: 300px;
}
</style>
