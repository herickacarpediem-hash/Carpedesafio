// ====================================================================
// CARPEDESAFIO — ADMIN DGG DASHBOARD (CLEAN CARPEDIEM BRAND IDENTITY)
// ====================================================================

function renderAdminDashboard(containerId, onNavigateToAudit) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;
  const teams = state.teams;
  const submissions = state.submissions;
  const leaderboard = window.appStore.getLeaderboard();
  const leadingTeam = leaderboard.length > 0 ? leaderboard[0] : null;

  const totalTeams = teams.length;
  const totalParticipants = state.teamMembers.length;
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(s => s.status === 'PENDING').length;
  const approvedSubmissions = submissions.filter(s => s.status === 'APPROVED').length;
  const rejectedSubmissions = submissions.filter(s => s.status === 'REJECTED').length;
  const duplicityAlerts = submissions.filter(s => s.isPossibleDuplicate).length;

  const totalPointsDistributed = leaderboard.reduce((acc, item) => acc + item.officialPoints, 0);
  const totalPointsPending = leaderboard.reduce((acc, item) => acc + item.pendingPoints, 0);

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Admin Header Banner -->
      <div class="card-clean p-6 border-l-4 border-l-[#0C1838]">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 mb-2">
              Painel Administrativo DGG & Auditoria
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading tracking-tight">
              Visão Geral da Mobilização
            </h1>
            <p class="text-slate-500 text-xs mt-1">
              Acompanhamento de equipes, submissões, auditorias e fechamentos da campanha.
            </p>
          </div>

          <button 
            onclick="triggerGoToAudit()"
            class="bg-[#0C1838] hover:bg-[#1E293B] text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ir para Auditoria</span>
            ${pendingSubmissions > 0 ? `
              <span class="bg-[#EA580C] text-white font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                ${pendingSubmissions} pendentes
              </span>
            ` : ''}
          </button>
        </div>
      </div>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div class="card-clean p-4">
          <div class="text-[10px] font-bold text-slate-400 uppercase">Equipes Ativas</div>
          <div class="text-2xl font-black text-[#0C1838] font-heading mt-1">${totalTeams}</div>
        </div>

        <div class="card-clean p-4">
          <div class="text-[10px] font-bold text-slate-400 uppercase">Participantes</div>
          <div class="text-2xl font-black text-slate-800 font-heading mt-1">${totalParticipants}</div>
        </div>

        <div class="card-clean p-4">
          <div class="text-[10px] font-bold text-slate-400 uppercase">Total Submissões</div>
          <div class="text-2xl font-black text-orange-600 font-heading mt-1">${totalSubmissions}</div>
        </div>

        <div class="card-clean p-4">
          <div class="text-[10px] font-bold text-slate-400 uppercase">Pendentes Auditoria</div>
          <div class="text-2xl font-black text-blue-600 font-heading mt-1">${pendingSubmissions}</div>
        </div>

        <div class="card-clean p-4 ${duplicityAlerts > 0 ? 'border-red-300 bg-red-50/50' : ''}">
          <div class="text-[10px] font-bold text-slate-400 uppercase">Alertas Duplicidade</div>
          <div class="text-2xl font-black ${duplicityAlerts > 0 ? 'text-red-600' : 'text-slate-700'} font-heading mt-1">
            ${duplicityAlerts}
          </div>
        </div>

        <div class="card-clean p-4">
          <div class="text-[10px] font-bold text-slate-400 uppercase">Ações Aprovadas</div>
          <div class="text-2xl font-black text-emerald-600 font-heading mt-1">${approvedSubmissions}</div>
        </div>

        <div class="card-clean p-4">
          <div class="text-[10px] font-bold text-slate-400 uppercase">Ações Reprovadas</div>
          <div class="text-2xl font-black text-red-600 font-heading mt-1">${rejectedSubmissions}</div>
        </div>

        <div class="card-clean p-4">
          <div class="text-[10px] font-bold text-slate-400 uppercase">Pontos Oficiais</div>
          <div class="text-2xl font-black text-emerald-600 font-heading mt-1">${totalPointsDistributed}</div>
        </div>

        <div class="card-clean p-4">
          <div class="text-[10px] font-bold text-slate-400 uppercase">Pontos Pendentes</div>
          <div class="text-2xl font-black text-orange-600 font-heading mt-1">${totalPointsPending}</div>
        </div>

        <div class="card-clean p-4 border-l-2 border-l-orange-500">
          <div class="text-[10px] font-bold text-orange-600 uppercase">Equipe Líder</div>
          <div class="text-sm font-extrabold text-[#0C1838] font-heading mt-1 truncate">
            ${leadingTeam ? leadingTeam.team.name : '-'}
          </div>
          <div class="text-[10px] text-slate-500 font-medium">
            ${leadingTeam ? leadingTeam.officialPoints + ' pts' : '-'}
          </div>
        </div>
      </div>

      <!-- Analytics Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 1: Pontos por Equipe -->
        <div class="card-clean p-6">
          <h3 class="text-sm font-bold text-[#0C1838] font-heading uppercase mb-4">
            Pontuação por Equipe (Oficial vs Provisória)
          </h3>
          <div class="h-60 relative">
            <canvas id="chart-teams-points"></canvas>
          </div>
        </div>

        <!-- Chart 2: Evolução da Pontuação por Semana -->
        <div class="card-clean p-6">
          <h3 class="text-sm font-bold text-[#0C1838] font-heading uppercase mb-4">
            Evolução Semanal de Pontuação
          </h3>
          <div class="h-60 relative">
            <canvas id="chart-weekly-evolution"></canvas>
          </div>
        </div>

        <!-- Chart 3: Distribuição por Categoria -->
        <div class="card-clean p-6">
          <h3 class="text-sm font-bold text-[#0C1838] font-heading uppercase mb-4">
            Distribuição por Categoria
          </h3>
          <div class="h-60 relative">
            <canvas id="chart-categories"></canvas>
          </div>
        </div>

        <!-- Chart 4: Status de Aprovação -->
        <div class="card-clean p-6">
          <h3 class="text-sm font-bold text-[#0C1838] font-heading uppercase mb-4">
            Status de Aprovação de Submissões
          </h3>
          <div class="h-60 relative">
            <canvas id="chart-approval-status"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  window.triggerGoToAudit = () => {
    onNavigateToAudit();
  };

  // Render Chart.js Canvas Charts
  setTimeout(() => {
    if (typeof Chart !== 'undefined') {
      const ctx1 = document.getElementById('chart-teams-points');
      if (ctx1) {
        new Chart(ctx1, {
          type: 'bar',
          data: {
            labels: leaderboard.map(l => l.team.name.split('—')[1] || l.team.name),
            datasets: [
              { label: 'Pontos Oficiais', data: leaderboard.map(l => l.officialPoints), backgroundColor: '#059669' },
              { label: 'Pontos Provisórios', data: leaderboard.map(l => l.provisionalPoints), backgroundColor: '#EA580C' }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#475569' } } },
            scales: {
              x: { ticks: { color: '#64748B' }, grid: { color: '#F1F5F9' } },
              y: { ticks: { color: '#64748B' }, grid: { color: '#F1F5F9' } }
            }
          }
        });
      }

      const ctx2 = document.getElementById('chart-weekly-evolution');
      if (ctx2) {
        new Chart(ctx2, {
          type: 'line',
          data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3'],
            datasets: [
              { label: 'Equipe Solar', data: [850, 1245, 1450], borderColor: '#EA580C', tension: 0.3 },
              { label: 'Equipe Maré', data: [720, 1120, 1320], borderColor: '#2563EB', tension: 0.3 },
              { label: 'Equipe Horizonte', data: [690, 980, 1180], borderColor: '#059669', tension: 0.3 }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#475569' } } },
            scales: {
              x: { ticks: { color: '#64748B' }, grid: { color: '#F1F5F9' } },
              y: { ticks: { color: '#64748B' }, grid: { color: '#F1F5F9' } }
            }
          }
        });
      }

      const ctx3 = document.getElementById('chart-categories');
      if (ctx3) {
        new Chart(ctx3, {
          type: 'doughnut',
          data: {
            labels: ['CarpeClub', 'WhatsApp', 'Instagram', 'Missão-relâmpago', 'Presencial'],
            datasets: [{
              data: [35, 25, 20, 12, 8],
              backgroundColor: ['#EA580C', '#2563EB', '#7C3AED', '#059669', '#D97706']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#475569' } } }
          }
        });
      }

      const ctx4 = document.getElementById('chart-approval-status');
      if (ctx4) {
        new Chart(ctx4, {
          type: 'pie',
          data: {
            labels: ['Aprovadas', 'Pendentes', 'Reprovadas', 'Duplicidades'],
            datasets: [{
              data: [approvedSubmissions, pendingSubmissions, rejectedSubmissions, duplicityAlerts],
              backgroundColor: ['#059669', '#2563EB', '#DC2626', '#EA580C']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#475569' } } }
          }
        });
      }
    }
  }, 100);
}
