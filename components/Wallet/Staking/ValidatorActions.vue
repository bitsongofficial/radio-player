<template>
  <v-card elevation="0">
    <v-toolbar color="transparent" flat>
      <v-spacer></v-spacer>
      <v-menu
        transition="slide-y-transition"
        :disabled="!canChooseOption"
        top
      >
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            :disabled="!canChooseOption"
            outlined
            v-on="on"
          >
            {{ selectedItem == null ? 'Underdelegate' : selectedItem }}
            <v-icon right dark>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in dropdownActions"
            :key="i"
            @click="onSelectDropdownAction(item)"
          >
            <v-list-item-title>
              {{ item }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        :disabled="!canDelegate"
        color="green"
        class="ml-2"
        outlined
        @click.stop="onSelectDeleagte"
      >
        Delegate
      </v-btn>
    </v-toolbar>
    <dialog-delegate
      v-if="showModalDelegations"
      :value="validator"
      v-on:cancel="onCloseDelagatesDialog"
    />
    <dialog-unbond
      v-if="showModalUnbond"
      :value="validator"
      v-on:cancel="onCloseUnbondDialog"
    />
    <dialog-redelegate
      v-if="showModalStaking"
      :value="validator"
      v-on:cancel="onCloseRedelegateDialog"
    />
  </v-card>
</template>

<script>
import DialogDelegate from '@/components/Wallet/Dialogs/DialogDelegate.vue'
import DialogUnbond from '@/components/Wallet/Dialogs/DialogUnbond.vue'
import DialogRedelegate from '@/components/Wallet/Dialogs/DialogRedelegate.vue'

export default {

  components: {
    DialogDelegate,
    DialogUnbond,
    DialogRedelegate
  },

  props: {
    validator: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      selectedItem: null,
      dropdownActions: [
        'Unbond',
        'Redelegate'
      ],
      showModalDelegations: false,
      showModalStaking: false,
      showModalUnbond: false
    }
  },

  computed: {
    canChooseOption () {
      // TODO: placeholder for choosing action if user has staked token on it
      return true
    },
    canDelegate () {
      // TODO: placeholder for can delegate check
      return true
    }
  },

  created () {
    // TODO: set initial seleceteItem (dropdown) value, (based on validator query?)
    this.selectedItem = this.dropdownActions[0]
  },

  methods: {
    onSelectDropdownAction (item) {
      // TODO: Open popup selection based on item
      this.selectedItem = item
      switch (item) {
        case 'Unbond':
          this.showModalUnbond = true
        break
        case 'Redelegate':
          this.showModalStaking = true
        break
        default:
          console.log(`Option ${item} not found.`)
        break
      }
    },
    onCloseDelagatesDialog () {
      this.showModalDelegations = false
    },
    onSelectDeleagte () {
      this.showModalDelegations = true
    },
    
    onCloseUnbondDialog () {
      this.showModalUnbond = false
    },
    onCloseRedelegateDialog () {
      this.showModalStaking = false
    }
  }

}
</script>
