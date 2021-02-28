<template>
  <div>
    <div class="d-flex">
      <h2 class="text-h2 mb-1">
        <slot name="title" />
        <slot name="action" v-if="$vuetify.breakpoint.mdAndUp" />
      </h2>
      <v-spacer></v-spacer>
      <div class="mt-3">
        <slot name="action" v-if="$vuetify.breakpoint.smAndDown" />
      </div>
    </div>
    <slider v-if="$vuetify.breakpoint.smAndDown" show-arrows>
      <template v-for="(item, i) in items">
        <track-grid-item :key="i" :item="item"></track-grid-item>
      </template>
    </slider>
    <v-slide-group v-else center-active class="ml-n2" show-arrows>
      <v-slide-item v-for="(item, i) in items" :key="i">
        <track-grid-item :item="item"></track-grid-item>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>

<script>
import TrackGridItem from "@/components/TrackGridItem";
import Slider from "@/components/Slider";

export default {
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  components: {
    TrackGridItem,
    Slider,
  },
};
</script>
