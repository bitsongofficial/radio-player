<template>
  <player-container>
    <player-picture></player-picture>
    <player-title></player-title>
    <v-spacer></v-spacer>
    <player-actions></player-actions>
    <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
    <player-duration :currentTime="currentTime"></player-duration>
    <player-btn-stop></player-btn-stop>
    <player-error-dialog
      v-if="error !== null"
      :text="error"
      v-on:close="error = null"
    ></player-error-dialog>
    <audio ref="hlsAudio"></audio>
  </player-container>
</template>

<script>
import Hls from "hls.js";
import { Howl } from "howler";
import { PLAYER_STATUS, toHHMMSS } from "@/lib/utils";
import { mapActions, mapGetters } from 'vuex';

import PlayerContainer from "@/components/Player/Container";
import PlayerPicture from "@/components/Player/Picture";
import PlayerTitle from "@/components/Player/Title";
import PlayerActions from "@/components/Player/Actions";
import PlayerDuration from "@/components/Player/Duration";
import PlayerBtnStop from "@/components/Player/BtnStop";
import PlayerErrorDialog from "@/components/Player/ErrorDialog";

export default {
  name: "b-player",

  components: {
    PlayerContainer,
    PlayerPicture,
    PlayerTitle,
    PlayerActions,
    PlayerDuration,
    PlayerBtnStop,
    PlayerErrorDialog
  },

  data() {
    return {
      provider: {
        html5: null,
        hls: null
      },
      error: null,
      bufferTimer: null,
      currentTime: 0
    };
  },

  watch: {
    currentTrack() {
      this.unloadAudio();

      if (this.currentTrack !== null) {
        console.log("----- new track -----", this.currentTrack);
        this.loadAudio();

        if (process.env.NODE_ENV === "production") {
          this.$gtag("event", "select_radio", {
            title: this.currentTrack.title
          });
        }
      }
    },
    paused(val) {
      if (val) {
        clearInterval(this.bufferTimer);
        if (this.provider.html5 !== null) {
          this.provider.html5.pause();
        } else if (this.provider.hls !== null) {
          this.$refs.hlsAudio.pause();
        }

        if (process.env.NODE_ENV === "production") {
          this.$gtag("event", "pause_radio", {
            title: this.currentTrack.title
          });
        }
      }
    },
    playing(val) {
      const ctx = this;

      if (val) {
        if (ctx.provider.html5 !== null) {
          this.provider.html5.play();
        } else if (ctx.provider.hls !== null) {
          this.$refs.hlsAudio.play();
        }

        if (process.env.NODE_ENV === "production") {
          this.$gtag("event", "play_radio", {
            title: this.currentTrack.title
          });
        }

        this.bufferTimer = setInterval(() => {
          if (ctx.provider.html5 !== null) {
            this.currentTime = ctx.provider.html5.seek();
          } else if (ctx.provider.hls !== null) {
            this.currentTime = Math.round(ctx.$refs.hlsAudio.currentTime);
          }

          if (process.env.NODE_ENV === "production") {
            if ((this.currentTime - 1) % 600 === 0) {
              this.$gtag("event", "listen_radio", {
                range: toHHMMSS(this.currentTime),
                title: this.currentTrack.title
              });
            }
          }
        }, 1000);
      }
    }
  },

  computed: {
    ...mapGetters({
      currentTrack: 'player/currentTrack',
      paused: 'player/paused',
      playing: 'player/playing'
    })
  },

  methods: {
    ...mapActions({
      stop: 'player/stop',
      play: 'player/play',
      destroy: 'player/destroy'
    }),

    loadAudio() {
      console.log("---- load new track ----");
      this.$store.commit("player/SET_STATUS", PLAYER_STATUS.LOADING);

      if (this.$device.isIos || !Hls.isSupported()) {
        console.log("provider: html5");
        this.provider.html5 = new Howl({
          src: [this.currentTrack.source],
          html5: true,
          format: ["mp3", "aac", "flac"]
        });

        this._setupHtml5Listeners();
      } else {
        console.log("provider: hls");

        Hls.DefaultConfig.debug = true;

        this.provider.hls = new Hls();
        this.provider.hls.attachMedia(this.$refs.hlsAudio);
        this._setupHlsListeners();

        if (this.currentTrack.isHls) {
          this.provider.hls.loadSource(this.currentTrack.source);
        } else {
          this.$refs.hlsAudio.src = this.currentTrack.source;
        }
      }
    },
    unloadAudio() {
      console.log("---- unload track ----");
      clearInterval(this.bufferTimer);

      if (this.provider.html5 !== null) {
        this.provider.html5.stop();
        this.provider.html5 = null;
        this.stop();
      } else if (this.provider.hls !== null) {
        this.$refs.hlsAudio.pause();
        this.provider.hls.stopLoad();
        this.provider.hls.detachMedia();
        this.provider.hls = null;
        this.currentTime = 0;
        this.stop();
      }

      if (process.env.NODE_ENV === "production") {
        this.$gtag("event", "stop_radio");
      }
    },
    _setupHlsListeners() {
      console.log("setupListeners");
      const ctx = this;
      this.provider.hls.on(Hls.Events.MANIFEST_PARSED, (evt, data) => {
        // this.$gtag("event", "hls.js", {
        //   event_name: "MANIFEST_PARSED",
        //   title: this.currentTrack.title
        // });
        console.log("ok");
      });

      this.provider.hls.on(Hls.Events.MEDIA_DETACHED, () => {
        clearInterval(ctx.bufferTimer);
      });

      this.$refs.hlsAudio.addEventListener("resize", this._handleHlsEvents);
      this.$refs.hlsAudio.addEventListener("seeking", this._handleHlsEvents);
      this.$refs.hlsAudio.addEventListener("seeked", this._handleHlsEvents);
      this.$refs.hlsAudio.addEventListener("pause", this._handleHlsEvents);
      this.$refs.hlsAudio.addEventListener("play", this._handleHlsEvents);
      this.$refs.hlsAudio.addEventListener("canplay", this._handleHlsEvents);
      this.$refs.hlsAudio.addEventListener(
        "canplaythrough",
        this._handleHlsEvents
      );
      this.$refs.hlsAudio.addEventListener("ended", this._handleHlsEvents);
      this.$refs.hlsAudio.addEventListener("playing", this._handleHlsEvents);
      this.$refs.hlsAudio.addEventListener("error", this._handleHlsEvents);
      this.$refs.hlsAudio.addEventListener(
        "loadedmetadata",
        this._handleHlsEvents
      );
      this.$refs.hlsAudio.addEventListener("loadeddata", this._handleHlsEvents);
      this.$refs.hlsAudio.addEventListener(
        "durationchange",
        this._handleHlsEvents
      );
    },
    _setupHtml5Listeners() {
      const ctx = this;

      this.provider.html5.once("load", function() {
        console.log("---- load completed ----");
        ctx.play();
      });

      this.provider.html5.on("loaderror", function(id, err) {
        console.log("---- load error ----");
        ctx.error = true;
        ctx.currentTime = 0;
        ctx.destroy();
      });

      this.provider.html5.on("playerror", function() {
        console.log("---- play error ----");
      });

      this.provider.html5.on("play", function() {
        console.log("---- play start ----");
      });

      this.provider.html5.on("end", function() {
        console.log("Finished!");
      });

      this.provider.html5.on("pause", function() {
        console.log("---- pause ----");
      });

      this.provider.html5.on("stop", function() {
        console.log("---- stop ----");
      });
    },
    _handleHlsEvents(evt) {
      switch (evt.type) {
        case "play":
          this.play();
          break;
        case "pause":
          break;
        case "loadedmetadata":
          this.$refs.hlsAudio.play();
        case "error":
          if (evt.type === "error") {
            const mediaError = evt.currentTarget.error;
            switch (mediaError.code) {
              case mediaError.MEDIA_ERR_ABORTED:
                this.error = "You aborted the audio playback";
                break;
              case mediaError.MEDIA_ERR_DECODE:
                this.error =
                  "The audio playback was aborted due to a corruption problem or because the audio used features your browser did not support";
                break;
              case mediaError.MEDIA_ERR_NETWORK:
                this.error =
                  "A network error caused the audio download to fail part-way";
                break;
              case mediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                this.error =
                  "The audio could not be loaded, either because the server or network failed or because the format is not supported";
                break;
            }
          }
      }
    }
  }
};
</script>
