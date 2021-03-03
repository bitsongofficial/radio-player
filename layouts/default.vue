<template>
  <v-app>
    <toolbar class="bg-transaprent" />
    <update-available-dialog v-if="update_available"></update-available-dialog>
    <v-main class="mb-8">
      <nuxt />
    </v-main>
    <b-player v-show="currentTrack !== null"></b-player>
    <v-footer> </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import Toolbar from "@/components/Toolbar";
import UpdateAvailableDialog from "@/components/UpdateAvailableDialog";
import BPlayer from "@/components/BPlayer";

export default {
  components: {
    Toolbar,
    UpdateAvailableDialog,
    BPlayer
  },

  data() {
    return {
      update_available: false
    };
  },

  async mounted() {
    const workbox = await window.$workbox;
    if (workbox) {
      console.log("workbox enabled");

      workbox.addEventListener("waiting", async event => {
        console.log("waiting-----------------", event);
        this.update_available = true;
      });

      workbox.addEventListener("installed", event => {
        if (event.isUpdate) {
          console.log("----------- update available -----------");
          this.update_available = true;
        }
      });
    }
  },

  computed: {
    ...mapGetters({
      currentTrack: 'player/currentTrack'
    })
  }
};
</script>

<style lang="sass">
a
  text-decoration: none !important

.v-application
  .text-h2
    font-size: 2.15rem!important
    font-weight: 600
    line-height: 3.65rem
    letter-spacing: -.03em!important
    font-family: "Poppins", sans-serif !important
    a
      color: #E53935
  .text-h3
    font-size: 1.85rem!important
    font-weight: 600
    line-height: 2.65rem
    letter-spacing: -.03em!important
    font-family: "Poppins", sans-serif !important

.theme--light.v-card > .v-card__text,
.theme--light.v-card .v-card__subtitle
  color: rgba(0, 0, 0, 1)

.theme--light > .v-application--wrap
  background-color: #eeeeee

.theme--dark.v-application
  background-color: #000

.v-slide-group__prev--disabled
  display: none !important

.v-slide-group__next, .v-slide-group__prev
  min-width: 22px !important
.bg-transparent
  background-color: transparent !important
</style>
