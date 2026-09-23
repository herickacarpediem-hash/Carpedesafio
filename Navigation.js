// ====================================================================
// CARPEDESAFIO — NAVIGATION & FULL-HEIGHT SIDEBAR (CARPEDIEM IDENTITY)
// ====================================================================

function renderHeaderNavbar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;
  const user = state.currentUser;
  if (!user) return;

  const isAdmin = user.role === 'ADMIN';
  const team = user.teamId ? state.teams.find(t => t.id === user.teamId) : null;
  const activeWeek = state.weeks.find(w => w.status === 'OPEN') || state.weeks[1];

  container.innerHTML = `
    <!-- Top Header Bar -->
    <header class="h-16 bg-[#0C1838] border-b border-slate-800 sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 shadow-md">
      <!-- Brand Logo & Week Badge -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <img 
            src="assets/logo-carpediem.png" 
            alt="Carpediem Homes" 
            class="h-8 object-contain bg-white/95 px-2 py-1 rounded-md shadow-sm" 
            onerror="this.style.display='none'"
          />
          <span class="font-heading font-black text-lg text-white tracking-tight border-l border-slate-700 pl-3">
            CarpeDesafio
          </span>
        </div>

        <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          ${activeWeek.title}
        </span>
      </div>

      <!-- User Info & Persona Quick Switcher -->
      <div class="flex items-center gap-4">
        <div class="relative group">
          <button class="bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2 cursor-pointer transition">
            <span>Trocar Perfil (${user.role === 'ADMIN' ? 'Admin' : 'Líder'})</span>
            <span class="text-[10px] text-slate-400">▼</span>
          </button>
          
          <div class="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 hidden group-hover:block z-50 text-slate-800">
            <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">Simular Perfil:</div>
            <button onclick="switchUser('admin@carpediemhomes.com.br')" class="w-full text-left px-2 py-1.5 text-xs text-slate-800 hover:bg-slate-100 rounded font-semibold flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-purple-600"></span> Administrador DGG
            </button>
            <button onclick="switchUser('lider.solar@carpediemhomes.com.br')" class="w-full text-left px-2 py-1.5 text-xs text-slate-800 hover:bg-slate-100 rounded font-semibold flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-orange-500"></span> Líder — Equipe Solar
            </button>
            <button onclick="switchUser('lider.mare@carpediemhomes.com.br')" class="w-full text-left px-2 py-1.5 text-xs text-slate-800 hover:bg-slate-100 rounded font-semibold flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span> Líder — Equipe Maré
            </button>
            <button onclick="switchUser('lider.horizonte@carpediemhomes.com.br')" class="w-full text-left px-2 py-1.5 text-xs text-slate-800 hover:bg-slate-100 rounded font-semibold flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Líder — Equipe Horizonte
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div class="w-8 h-8 rounded-full ${isAdmin ? 'bg-purple-600' : 'bg-orange-500'} flex items-center justify-center font-bold text-white text-xs shadow">
            ${user.name.charAt(0)}
          </div>
          <div class="hidden md:block text-left">
            <div class="text-xs font-bold text-white">${user.name}</div>
            <div class="text-[10px] text-orange-400 font-medium">${isAdmin ? 'Administrador DGG' : (team ? team.name : 'Líder')}</div>
          </div>
        </div>

        <button 
          onclick="handleLogout()" 
          title="Sair"
          class="text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded hover:bg-slate-800 transition cursor-pointer font-semibold"
        >
          Sair
        </button>
      </div>
    </header>
  `;
}

function renderSidebarNav(containerId, activeTab, onSelectTab) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;
  const user = state.currentUser;
  if (!user) return;

  const isAdmin = user.role === 'ADMIN';

  const leaderMenuItems = [
    { id: 'dashboard', label: 'Missões & Envio' },
    { id: 'ranking', label: 'Ranking Geral' },
    { id: 'my-submissions', label: 'Minhas Submissões' },
    { id: 'history', label: 'Histórico Semanal' },
    { id: 'my-team', label: 'Minha Equipe' }
  ];

  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Dashboard Geral' },
    { id: 'ranking', label: 'Ranking Geral' },
    { id: 'audit-panel', label: 'Painel de Auditoria', badge: state.submissions.filter(s => s.status === 'PENDING').length },
    { id: 'weekly-closure', label: 'Fechamento Semanal' },
    { id: 'missions-manage', label: 'Gerenciar Missões' },
    { id: 'rules-manage', label: 'Regras de Pontuação' },
    { id: 'teams-manage', label: 'Equipes & Integrantes' },
    { id: 'audit-logs', label: 'Logs de Auditoria' },
    { id: 'reports', label: 'Exportar Relatórios' }
  ];

  const menuItems = isAdmin ? adminMenuItems : leaderMenuItems;

  container.innerHTML = `
    <!-- Full-Height Sidebar Navigation -->
    <aside class="w-64 bg-[#0C1838] border-r border-slate-800 shrink-0 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div class="space-y-3">
        <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-1">
          ${isAdmin ? 'PAINEL ADMINISTRATIVO' : 'PAINEL DO LÍDER'}
        </div>

        <nav class="space-y-1">
          ${menuItems.map(item => `
            <button
              onclick="navSelect('${item.id}')"
              class="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-lg font-semibold text-xs transition cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-[#EA580C] text-white font-bold shadow-sm' 
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }"
            >
              <span>${item.label}</span>
              ${item.badge ? `
                <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                  ${item.badge}
                </span>
              ` : ''}
            </button>
          `).join('')}
        </nav>
      </div>

      <!-- Footer Brand Credit in Sidebar -->
      <div class="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
        <div class="font-bold text-slate-400">carpediem HOMES</div>
        <div>Prêmio Reclame AQUI 2026</div>
      </div>
    </aside>

    <!-- Mobile Bottom Navigation -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0C1838] border-t border-slate-800 flex items-center justify-around z-40 px-2">
      ${menuItems.slice(0, 4).map(item => `
        <button 
          onclick="navSelect('${item.id}')"
          class="flex flex-col items-center justify-center w-full h-full text-[11px] font-semibold ${
            activeTab === item.id ? 'text-orange-400 font-bold' : 'text-slate-400'
          }"
        >
          <span>${item.label.split(' ')[0]}</span>
        </button>
      `).join('')}
    </div>
  `;

  window.navSelect = (tabId) => {
    onSelectTab(tabId);
  };

  window.switchUser = (email) => {
    window.appStore.login(email);
    window.location.reload();
  };

  window.handleLogout = () => {
    window.appStore.logout();
    window.location.reload();
  };
}
