import TestRoute from '../components/TestRoute/index.vue';
import Header from '../components/Header/index.vue';
import Footer from '../components/Footer/index.vue';

import HomePage from '../components/HomePage/index.vue';

export default [
  { path: '/', 
    components: {
      default: HomePage,
      header: Header,
      footer: Footer
      }
  },
  { path: '/projects', 
    components: {
      default: {template: '<div>This is the projects route</div>' },
      footer: Footer, 
      header: Header
      }
  },
  { path: '/projects/:project_id', 
    components: {
      default: {template: '<div>This is the individual project route</div>'},
      footer: Footer, 
      header: Header
      }
  },
  { path: '/members', 
    components: {
      default: {template: '<div>This is the members route</div>' },
      footer: Footer, 
      header: Header
      }
  },
  { path: '/members/:member_id', 
    components: {
      default: {template: '<div>This is the individual member route</div>'},
      footer: Footer, 
      header: Header
      }
  },
  { path: '/communities', 
    components: {
      default: {template: '<div>This is the communities route</div>' },
      footer: Footer, 
      header: Header
      }
  },
  { path: '/communities/:community_name', 
    components: {
      default: {template: '<div>This is the individual community route</div>'},
      footer: Footer, 
      header: Header
      }
  }
];