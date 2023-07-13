<template>
  <v-app>
    <v-app-bar clipped-left app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" title="Ocultar munus" />
      <v-btn icon @click.stop="miniVariant = !miniVariant" :title="`${miniVariant ? 'Expandir' : 'Recolher'} menus`">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-img src="/Logo-Corretora.png" max-width="100" class="mx-2"/>
      <v-toolbar-title>{{ title.toUpperCase() }}</v-toolbar-title>
      <v-spacer />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" clipped app>
      <v-list nav dense>
        <template v-for="menu in menus">
          <v-list-item v-if="!menu.submenus" :to="menu.to" link active-class="blue--text text--darken-4"
            :title="menu.name">
            <v-list-item-action>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="menu.name" />
            </v-list-item-content>
          </v-list-item>


          <v-list-group :prepend-icon="menu.icon" v-else :title="menu.name">
            <template #activator>
              <v-list-item-title>{{ menu.name }}</v-list-item-title>
            </template>

            <v-list-item v-for="(submenu, index) in menu.submenus" :key="index" :to="submenu.to" link
              :title="submenu.name">
              <v-list-item-action>
                <v-icon small>{{ submenu.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="submenu.name" />
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-skeleton-loader v-if="loading" type="table-heading, list-item-two-line, list-item-three-line, list-item-three-line, 
        list-item-three-line, list-item-three-line, list-item-three-line, table-tfoot"></v-skeleton-loader>
      <template v-else>
        <v-container class="d-flex justify-center" fluid>
          <client-only>
            <vue-snotify></vue-snotify>
          </client-only>
          <Nuxt />
        </v-container>
      </template>
    </v-main>
    <v-footer class="pa-1">
      <v-card-text class="text-center pa-1">
        &copy; {{ new Date().getFullYear() }} {{ title }}</v-card-text>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: true,
      miniVariant: false,
      loading: true,
      menus: [
        {
          name: "Períodos",
          icon: "mdi-calendar-range",
          to: '/periodos'
        },
        {
          name: "Produtos",
          icon: "mdi-gift-open",
          to: '/produtos'
        },
        {
          name: "Vendas",
          icon: "mdi-cash-register",
          to: '/vendas'
        },
        {
          name: "Parametrização",
          icon: "mdi-alarm-panel",
          to: '/parametrizacao'
        },
        {
          name: "Relatórios",
          icon: "mdi-file-multiple",
          submenus: [
            {
              name: "Vidas Vendedor",
              to: "/relatorios/vidas-vendedor",
              icon: "mdi-account-group",
            },
            {
              name: "Lucro Vendedor",
              to: "/relatorios/lucro-vendedor",
              icon: "mdi-account-cash",
            }
          ],
        },
        {
          name: "Parcelas",
          icon: "mdi-cash-multiple",
          to: '/parcelas'
        },
        {
          name: "Vendedores",
          icon: "mdi-account",
          to: '/vendedores'
        },

      ],
      title: 'França Planos de Saúde'
    }
  },
  mounted() {
    this.loading = false
  }
}
</script>
