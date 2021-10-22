export const state = () => ({
  dark_theme: true
});

export const getters = {
  dark_theme: state => {
    return state.dark_theme;
  }
};

export const mutations = {
  toggleDarkTheme: state => {
    state.dark_theme = !state.dark_theme;
  }
};
