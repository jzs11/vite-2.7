import { createApp } from 'vue';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import AutoComplete from 'primevue/autocomplete';
import Avatar from 'primevue/avatar';
import AvatarGroup from 'primevue/avatargroup';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Chip from 'primevue/chip';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmPopup from 'primevue/confirmpopup';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import InlineMessage from 'primevue/inlinemessage';
import Inplace from 'primevue/inplace';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Message from 'primevue/message';
import OverlayPanel from 'primevue/overlaypanel';
import Password from 'primevue/password';
import RadioButton from 'primevue/radiobutton';
import 'primevue/resources/primevue.min.css';
import Ripple from 'primevue/ripple';
import ScrollPanel from 'primevue/scrollpanel';
import Sidebar from 'primevue/sidebar';
import Skeleton from 'primevue/skeleton';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ToggleButton from 'primevue/togglebutton';
import Tooltip from 'primevue/tooltip';

import router from '@/ts/router/index';

import App from './App.vue';

createApp(App)
  .use(PrimeVue, { ripple: true })
  .use(router)
  .use(ConfirmationService)
  .use(ToastService)

  .directive('tooltip', Tooltip)
  .directive('ripple', Ripple)

  .component('AutoComplete', AutoComplete)
  .component('Avatar', Avatar)
  .component('AvatarGroup', AvatarGroup)
  .component('Breadcrumb', Breadcrumb)
  .component('Button', Button)
  .component('Card', Card)
  .component('ConfirmDialog', ConfirmDialog)
  .component('ConfirmPopup', ConfirmPopup)
  .component('DataView', DataView)
  .component('Divider', Divider)
  .component('Dropdown', Dropdown)
  .component('Dialog', Dialog)
  .component('InlineMessage', InlineMessage)
  .component('InputSwitch', InputSwitch)
  .component('InputText', InputText)
  .component('Inplace', Inplace)
  .component('Menu', Menu)
  .component('Menubar', Menubar)
  .component('Message', Message)
  .component('Password', Password)
  .component('RadioButton', RadioButton)
  .component('Skeleton', Skeleton)
  .component('TabView', TabView)
  .component('TabPanel', TabPanel)
  .component('Textarea', Textarea)
  .component('Toast', Toast)
  .component('OverlayPanel', OverlayPanel)
  .component('ToggleButton', ToggleButton)
  .component('Sidebar', Sidebar)
  .component('InputNumber', InputNumber)
  .component('Calendar', Calendar)
  .component('Checkbox', Checkbox)
  .component('Chip', Chip)
  .component('Splitter', Splitter)
  .component('SplitterPanel', SplitterPanel)
  .component('ScrollPanel', ScrollPanel)

  .mount('#app');
