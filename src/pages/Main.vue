<template>
  <q-layout>
    <q-page-container>
      <q-page style="background-color: #f39766" class="flex flex-center">
        <q-card style="width: 450px; background-color: #f39766;" flat>
          <img src="logo.png" />
          <div class="text-center q-px-md">
            <q-btn :to="{ name: 'Sign in' }" label="Sign in" class="q-mt-md full-width" outline style="color: #f6f6f6" /> <br />
            <q-btn :to="{ name: 'Sign up' }" label="Create an Account" style="color: #f6f6f6" class="q-mt-md full-width" outline />
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
