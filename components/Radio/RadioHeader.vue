<template>
  <v-img
    :src="radio.picture"
    gradient="to bottom, rgba(0,0,0,.4), rgba(0,0,0,1)"
    :height="$vuetify.breakpoint.mdAndUp ? height : ``"
  >
    <v-container fluid class="d-flex align-end fill-height">
      <v-row align="end">
        <v-col md="9" class="mx-auto py-8">
          <v-row justify="start" align="start">
            <v-col
              :class="{
                'flex-grow-0 flex-shrink-0 pr-6 pl-0':
                  $vuetify.breakpoint.mdAndUp
              }"
              v-if="radio.picture !== null"
            >
              <v-img :src="radio.picture" max-width="265" max-height="265" />
            </v-col>
            <v-col align-self="center" class="flex-grow-1 flex-shrink-0">
              <h1 class="text-h2">{{ radio.name }}</h1>
              <p>{{ radio.country.name }}</p>
              <div class="subtitle-1 min-h-24">
                <v-flex class="d-flex flex-row">
                  <!-- TODO: Disabled Placeholder social links
                  <v-btn icon :href="radio.website" target="_blank">
                    <v-icon>mdi-web</v-icon>
                  </v-btn>
                  <v-btn icon :href="radio.contact">
                    <v-icon>mdi-email-outline</v-icon>
                  </v-btn>

                  <v-btn icon href="#" target="_blank">
                    <v-icon>mdi-facebook</v-icon>
                  </v-btn>
                  <v-btn icon href="#" target="_blank">
                    <v-icon>mdi-instagram</v-icon>
                  </v-btn>
                  <v-btn icon href="#" target="_blank">
                    <v-icon>mdi-twitter</v-icon>
                  </v-btn>
                  <v-btn icon href="#" target="_blank">
                    <v-icon>mdi-youtube</v-icon>
                  </v-btn>
                -->
                </v-flex>
              </div>
              <v-card-actions class="px-0">
                <v-btn
                  class="pr-4"
                  color="white"
                  depressed
                  light
                  @click.stop="onPlay(radio)"
                >
                  <v-icon left>mdi-play</v-icon>
                  Play
                </v-btn>
                <!-- TODO: Connect to contextual action
                <v-btn outlined>
                  <v-icon left>mdi-plus-box-multiple</v-icon>
                  Follow
                </v-btn> -->
                <v-menu bottom left>
                  <template v-slot:activator="{ on }">
                    <v-btn icon class="ml-4" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list tile class="py-0">
                    <v-list-item @click.stop="() => (showDetails = true)">
                      <v-list-item-title>Details</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-col>
            <dialog-radio-details
              v-if="showDetails"
              :city="radio.city.name"
              :country="radio.country.name"
              :topic="radio.topic"
              :stream-type="radio.stream_type"
              :contact="radio.contact"
              :description="radio.description"
              v-on:close="() => (showDetails = false)"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script>
import { mapActions } from 'vuex';
import DialogRadioDetails from "@/components/Radio/DialogRadioDetails.vue";

export default {
  components: {
    DialogRadioDetails
  },
  props: {
    height: {
      type: Number,
      default: 550
    },
    radio: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showDetails: false
    };
  },
  methods: {
    ...mapActions({
      setCurrentTrack: 'player/setCurrentTrack'
    }),
    onPlay(item) {
      this.setCurrentTrack(item.slug);
    }
  }
};
</script>
