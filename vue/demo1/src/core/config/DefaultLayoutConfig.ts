import LayoutConfigTypes from "@/core/config/LayoutConfigTypes";

const config: LayoutConfigTypes = {
  themeName: "Metronic",
  themeVersion: "8.0.15",
  demo: "demo1",
  main: {
    type: "default",
    primaryColor: "#EF1E24",
    logo: {
      dark: "media/logos/logo-1.svg",
      light: "media/logos/Logo.png"
    }
  },
  loader: {
    logo: "media/logos/logo.png",
    display: true,
    type: "spinner-logo"
  },
  scrollTop: {
    display: true
  },
  header: {
    display: true,
    menuIcon: "font",
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true
    }
  },
  toolbar: {
    display: false,
    width: "fluid",
    fixed: {
      desktop: true,
      tabletAndMobile: true
    }
  },
  aside: {
    display: false,
    theme: "dark",
    fixed: true,
    menuIcon: "svg",
    minimized: false,
    minimize: true,
    hoverable: true
  },
  content: {
    width: "fixed"
  },
  footer: {
    width: "fluid"
  }
};

export default config;
