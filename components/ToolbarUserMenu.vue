<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :nudge-width="200"
      :close-on-content-click="false"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-avatar style="cursor:pointer" v-on="on" size="48">
          <Jdenticon :address="address" />
        </v-avatar>
      </template>

      <v-card width="300">
        <v-list-item>
          <v-list-item-avatar>
            <Jdenticon :address="address" />
          </v-list-item-avatar>
          <v-list-item-content></v-list-item-content>
          <v-list-item-action>
            <v-slide-x-reverse-transition>
              <span v-if="copied" class="v-markup__copied">Copied</span>
            </v-slide-x-reverse-transition>
            <v-btn @click="copyAddress" aria-label="Copy" icon>
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon @click.stop="showAddress = true">
              <v-icon>mdi-qrcode-scan</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-subtitle>{{ address }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon color="grey darken-1">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-title v-text="item.title" />
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <v-list-item-action>
            <v-icon color="grey darken-1">mdi-brightness-4</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Theme</v-list-item-title>
            <v-list-item-subtitle>{{
              dark_theme ? `dark` : `light`
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-switch
              v-model="$vuetify.theme.dark"
              @click="toggleTheme"
            ></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-card>
    </v-menu>
    <dialog-wallet-address v-if="showAddress" v-on:close="onCloseAddress" />
  </div>
</template>

<script>
import Jdenticon from "@/components/Jdenticon";
import DialogWalletAddress from "@/components/Wallet/Dialogs/DialogWalletAddress.vue";

export default {
  components: {
    Jdenticon,
    DialogWalletAddress
  },
  data() {
    return {
      menu: false,
      showAddress: false,
      copied: false
    };
  },
  methods: {
    toggleTheme() {
      this.$store.commit(`app/toggleDarkTheme`);
      this.$vuetify.theme.dark = this.dark_theme;
    },
    onCloseAddress() {
      this.showAddress = false;
    },
    copyAddress() {
      const tmp = document.createElement('textarea')
      tmp.textContent = this.address
      tmp.style.position = "fixed"
      document.body.appendChild(tmp)
      tmp.select()
      document.execCommand("copy")
      this.copied = true

      if (window.getSelection) {
        if (window.getSelection().empty) {
          // Chrome
          window.getSelection().empty()
        } else if (window.getSelection().removeAllRanges) {
          // Firefox
          window.getSelection().removeAllRanges()
        }
      } else if (document.selection) {
        // IE?
        document.selection.empty()
      }
      setTimeout(() => {
        this.copied = false
        tmp.remove()
      }, 1000)
    }
  },
  computed: {
    address() {
      return this.$store.getters[`wallet/address`];
    },
    dark_theme() {
      return this.$store.getters[`app/dark_theme`];
    },
    items() {
      return [
        {
          icon: "mdi-wallet",
          title: "Wallet",
          to: "/wallet"
        },
        {
          icon: "mdi-exit-to-app",
          title: "Log out",
          to: "/auth/logout"
        }
      ];
    }
  }
};
</script>

<style scoped>
.v-list-item__title,
.v-list-item__subtitle {
  white-space: normal;
}
.v-markup__copied {
  margin-top:5px;
  margin-right: 40px;
}
</style>
