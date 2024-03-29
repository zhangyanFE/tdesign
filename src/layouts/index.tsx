import Vue, { VNode } from 'vue';
import { mapGetters } from 'vuex';
import TdesignHeader from './components/Header.vue';
import TdesignBreadcrumb from './components/Breadcrumb.vue';
import TdesignFooter from './components/Footer.vue';
import TdesignSideNav from './components/SideNav';
import TdesignContent from './components/Content.vue';

import { prefix } from '@/config/global';
import TdesignSetting from './setting.vue';
import { SettingType, ClassName } from '@/interface';
import '@/style/layout.less';

const name = `${prefix}-base-layout`;

export default Vue.extend({
  name,
  components: {
    TdesignHeader,
    TdesignFooter,
    TdesignSideNav,
    TdesignSetting,
    TdesignBreadcrumb,
  },
  computed: {
    ...mapGetters({
      showSidebar: 'setting/showSidebar',
      showHeader: 'setting/showHeader',
      showHeaderLogo: 'setting/showHeaderLogo',
      showSidebarLogo: 'setting/showSidebarLogo',
      showFooter: 'setting/showFooter',
      mode: 'setting/mode',
      menuRouters: 'permission/routers',
    }),
    setting(): SettingType {
      return this.$store.state.setting;
    },
    mainLayoutCls(): Array<ClassName> {
      return [
        {
          't-layout-has-sider': this.showSidebar,
        },
      ];
    },
    headerMenu() {
      const { layout, splitMenu } = this.$store.state.setting;
      const { menuRouters } = this;
      if (layout === 'mix') {
        if (splitMenu) {
          return menuRouters.map((menu) => ({
            ...menu,
            children: [],
          }));
        }
        return [];
      }
      return menuRouters;
    },
    sideMenu() {
      const { layout, splitMenu } = this.$store.state.setting;
      let { menuRouters } = this;
      if (layout === 'mix' && splitMenu) {
        menuRouters.forEach((menu) => {
          if (this.$route.path.indexOf(menu.path) === 0) {
            menuRouters = menu.children.map((subMenu) => ({ ...subMenu, path: `${menu.path}/${subMenu.path}` }));
          }
        });
      }
      return menuRouters;
    },
  },
  methods: {
    renderSidebar(): VNode {
      // const theme =
      //   this.setting.mode === 'dark' ? 'dark' : this.setting.layout === 'mix' ? 'light' : this.setting.theme;
      // menu 组件最多支持 3级菜单
      const maxLevel = this.setting.splitMenu ? 2 : 3;

      return (
        this.showSidebar && (
          <tdesign-side-nav
            showLogo={this.showSidebarLogo}
            layout={this.setting.layout}
            isFixed={this.setting.isSidebarFixed}
            menu={this.sideMenu}
            theme={this.mode}
            isCompact={this.setting.isSidebarCompact}
            maxLevel={maxLevel}
          />
        )
      );
    },
    renderHeader(): VNode {
      const maxLevel = this.setting.splitMenu ? 1 : 3;
      return (
        this.showHeader && (
          <tdesign-header
            showLogo={this.showHeaderLogo}
            maxLevel={maxLevel}
            theme={this.mode}
            layout={this.setting.layout}
            isFixed={this.setting.isHeaderFixed}
            menu={this.headerMenu}
            isCompact={this.setting.isSidebarCompact}
          />
        )
      );
    },
    renderContent(): VNode {
      const { showBreadcrumb } = this.setting;
      const { showFooter } = this;
      return (
        <t-layout class={[`${prefix}-layout`]}>
          <t-content class={`${prefix}-content-layout`}>
            {showBreadcrumb && <tdesign-breadcrumb />}
            <TdesignContent />
          </t-content>
          {showFooter && this.renderFooter()}
        </t-layout>
      );
    },

    renderFooter(): VNode {
      return (
        <t-footer class={`${prefix}-footer-layout`}>
          <tdesign-footer />
        </t-footer>
      );
    },
  },

  render(): VNode {
    const { layout } = this.setting;
    const header = this.renderHeader();
    const sidebar = this.renderSidebar();
    const content = this.renderContent();

    return (
      <div class={`${prefix}-wrapper`}>
        {layout === 'side' ? (
          <t-layout class={this.mainLayoutCls} key="side">
            <t-aside>{sidebar}</t-aside>
            <t-layout>{[header, content]}</t-layout>
          </t-layout>
        ) : (
          <t-layout key="no-side">
            {header}
            <t-layout class={this.mainLayoutCls}>{[sidebar, content]}</t-layout>
          </t-layout>
        )}
        <tdesign-setting />
      </div>
    );
  },
});
