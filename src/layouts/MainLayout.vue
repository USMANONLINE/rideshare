<template>
  <q-layout view="hhh LpR fFf">

    <q-header style="background-color: #f39766" reveal elevated class="text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
          Ride Share
        </q-toolbar-title>
        <q-btn dense flat round icon="more_vert" @click="left = !left" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" overlay bordered
              content-class="bg-grey-3"
              :width="200"
    >
      <q-scroll-area class="fit">
        <q-list separator>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              Home
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="directions_car" />
            </q-item-section>
            <q-item-section>
              My Trips
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>
            <q-item-section>
              Profile
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              Logout
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer style="background-color: #f39766" bordered class="text-white">
      <q-tabs dense>
        <q-route-tab
          label="Home"
          icon="home"
          :to="{ name: 'Main' }"
          exact
        />
        <q-route-tab
          no-caps
          label="Trips"
          icon="directions_car"
          :to="{ name: 'Trips' }"
          exact
        />
        <q-route-tab
          no-caps
          label="Alerts"
          icon="notifications"
          :to="{ name: 'Trips' }"
          exact
        />
        <q-route-tab
          label="Profile"
          icon="account_circle"
          :to="{ name: 'Profile' }"
          exact
        />
      </q-tabs>
    </q-footer>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      left: false
    }
  }
}
</script>
