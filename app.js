// ====================================================================
// CARPEDESAFIO — MAIN APPLICATION ROUTER & LAYOUT DISPATCHER
// ====================================================================

class CarpeDesafioApp {
  constructor() {
    this.currentTab = null;
    this.init();
  }

  init() {
    // Subscribe to store updates
    window.appStore.subscribe(() => this.render());
    this.render();
  }

  render() {
    const root = document.getElementById('app-root');
    if (!root) return;

    const state = window.appStore.state;
    const user = state.currentUser;

    // 1. If not logged in, render LoginForm
    if (!user) {
      root.innerHTML = `<div id="login-container"></div>`;
      renderLoginForm('login-container', (loggedInUser) => {
        this.currentTab = loggedInUser.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard';
        this.render();
      });
      return;
    }

    // Default tab if none set
    if (!this.currentTab) {
      this.currentTab = user.role === 'ADMIN' ? 'admin-dashboard' : 'dashboard';
    }

    // 2. Render Main App Layout with Full Height Sidebar & Header
    root.innerHTML = `
      <div class="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col">
        <!-- Top Header Navbar -->
        <div id="header-container"></div>

        <div class="flex-1 flex overflow-hidden min-h-[calc(100vh-4rem)]">
          <!-- Sidebar Navigation Column -->
          <div id="sidebar-container"></div>

          <!-- Main Content Area -->
          <main class="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto pb-24 md:pb-12">
            <div id="main-content-view"></div>
          </main>
        </div>

        <!-- Global Action Modal Container -->
        <div id="action-modal-root"></div>
      </div>
    `;

    // Render Header & Sidebar Navigation
    renderHeaderNavbar('header-container');
    renderSidebarNav('sidebar-container', this.currentTab, (selectedTab) => {
      this.currentTab = selectedTab;
      this.render();
    });

    // Dispatch active tab content
    this.renderActiveView();
  }

  renderActiveView() {
    const viewContainer = 'main-content-view';

    switch (this.currentTab) {
      case 'dashboard':
        renderLeaderDashboard(viewContainer, (prefill) => this.openSubmitModal(prefill));
        break;

      case 'admin-dashboard':
        renderAdminDashboard(viewContainer, () => {
          this.currentTab = 'audit-panel';
          this.render();
        });
        break;

      case 'ranking':
        renderRankingView(viewContainer);
        break;

      case 'audit-panel':
        renderAuditPanel(viewContainer);
        break;

      case 'weekly-closure':
        renderWeeklyClosureView(viewContainer);
        break;

      case 'rules-manage':
        renderRuleManagerView(viewContainer);
        break;

      case 'missions-manage':
      case 'missions':
        renderMissionManagerView(viewContainer);
        break;

      case 'audit-logs':
        renderAuditLogsView(viewContainer);
        break;

      case 'reports':
        renderReportsView(viewContainer);
        break;

      case 'teams-manage':
        renderTeamsManagerView(viewContainer);
        break;

      case 'history':
        renderHistoryView(viewContainer);
        break;

      case 'my-team':
        renderMyTeamView(viewContainer);
        break;

      case 'my-submissions':
        renderLeaderDashboard(viewContainer, (prefill) => this.openSubmitModal(prefill));
        break;

      default:
        renderLeaderDashboard(viewContainer, (prefill) => this.openSubmitModal(prefill));
        break;
    }
  }

  openSubmitModal(prefillData = {}) {
    renderSubmitActionModal(
      'action-modal-root',
      prefillData,
      () => {
        document.getElementById('action-modal-root').innerHTML = '';
      },
      () => {
        this.render();
      }
    );
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new CarpeDesafioApp();
});
