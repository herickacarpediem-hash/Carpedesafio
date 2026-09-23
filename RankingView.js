// ====================================================================
// CARPEDESAFIO — RANKING (CLEAN CARPEDIEM BRAND IDENTITY)
// ====================================================================

function renderRankingView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;
  const activeWeek = state.weeks.find(w => w.status === 'OPEN') || state.weeks[1];
  const isWeekClosed = activeWeek.status === 'CLOSED';

  let activeTab = 'OFFICIAL';

  const renderContent = () => {
    const leaderboard = window.appStore.getLeaderboard();

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-200 mb-2">
              Classificação da Campanha
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading">
              Ranking Geral das Equipes
            </h1>
            <p class="text-slate-500 text-xs mt-1">
              Classificação atualizada com base na pontuação acumulada das equipes.
            </p>
          </div>

          ${isWeekClosed ? `
            <div class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold">
              Pontuação Congelada (${activeWeek.title})
            </div>
          ` : ''}
        </div>

        <!-- Official vs Provisional Score Toggle Tabs -->
        <div class="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit text-xs font-bold">
          <button 
            id="tab-official" 
            class="px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'OFFICIAL' 
                ? 'bg-[#0C1838] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }"
          >
            Pontuação Oficial (Auditada)
          </button>

          <button 
            id="tab-provisional" 
            class="px-4 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'PROVISIONAL' 
                ? 'bg-[#EA580C] text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }"
          >
            Pontuação Provisória
          </button>
        </div>

        <!-- Leaderboard Podium Cards (Top 3) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${leaderboard.slice(0, 3).map((item, idx) => {
            const rankTitle = idx === 0 ? '1º LUGAR' : idx === 1 ? '2º LUGAR' : '3º LUGAR';
            const ptsToShow = activeTab === 'OFFICIAL' ? item.officialPoints : item.provisionalPoints;
            const borderAccent = idx === 0 ? 'border-l-orange-500' : 'border-l-slate-400';

            return `
              <div class="card-clean p-6 border-l-4 ${borderAccent} flex flex-col justify-between">
                <div>
                  <div class="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest mb-2">
                    ${rankTitle}
                  </div>
                  <h3 class="text-xl font-black text-[#0C1838] font-heading">
                    ${item.team.name}
                  </h3>
                  <div class="text-3xl font-black text-slate-900 font-heading mt-3">
                    ${ptsToShow.toLocaleString('pt-BR')} <span class="text-xs font-normal text-slate-500">pts</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div class="flex justify-between text-slate-600">
                    <span>Participação da Equipe:</span>
                    <span class="font-bold text-emerald-600">${item.participationPercentage}%</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 rounded-full" style="width: ${item.participationPercentage}%"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Leaderboard Table -->
        <div class="card-clean overflow-hidden">
          <table class="w-full text-left text-xs text-slate-700">
            <thead class="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th class="px-6 py-4">Posição</th>
                <th class="px-6 py-4">Equipe</th>
                <th class="px-6 py-4">Pontos Oficiais</th>
                <th class="px-6 py-4">Pontos Provisórios</th>
                <th class="px-6 py-4">Participação</th>
                <th class="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              ${leaderboard.map((item, idx) => `
                <tr class="hover:bg-slate-50 transition">
                  <td class="px-6 py-4 font-extrabold text-base text-slate-900">${idx + 1}º</td>
                  <td class="px-6 py-4 font-bold text-[#0C1838] text-sm">${item.team.name}</td>
                  <td class="px-6 py-4 font-extrabold text-emerald-600 text-sm">${item.officialPoints} pts</td>
                  <td class="px-6 py-4 font-bold text-orange-600 text-sm">${item.provisionalPoints} pts</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 rounded-full" style="width: ${item.participationPercentage}%"></div>
                      </div>
                      <span class="font-bold text-slate-800">${item.participationPercentage}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    ${isWeekClosed 
                      ? `<span class="badge-clean badge-navy">Congelado</span>`
                      : `<span class="badge-clean badge-emerald">Ativo</span>`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById('tab-official').addEventListener('click', () => {
      activeTab = 'OFFICIAL';
      renderContent();
    });
    document.getElementById('tab-provisional').addEventListener('click', () => {
      activeTab = 'PROVISIONAL';
      renderContent();
    });
  };

  renderContent();
}
