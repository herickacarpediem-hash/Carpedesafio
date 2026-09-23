// ====================================================================
// CARPEDESAFIO — WEEKLY CLOSURE (CLEAN CARPEDIEM BRAND IDENTITY)
// ====================================================================

function renderWeeklyClosureView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;

  const renderContent = () => {
    container.innerHTML = `
      <div class="space-y-6">
        <div>
          <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 mb-2">
            Gestão Semanal DGG
          </div>
          <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading">
            Gestão de Semanas e Fechamentos
          </h1>
          <p class="text-slate-500 text-xs mt-1">
            Encerre semanas, congele pontuações oficiais e libere a nova rodada da competição.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${state.weeks.map(week => {
            let statusBadge = `<span class="badge-clean badge-emerald">Semana Aberta</span>`;
            if (week.status === 'CLOSED') statusBadge = `<span class="badge-clean badge-rose">Semana Encerrada</span>`;
            if (week.status === 'IN_AUDIT') statusBadge = `<span class="badge-clean badge-amber">Em Auditoria</span>`;

            return `
              <div class="card-clean p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="font-mono text-xs font-bold text-orange-600">SEMANA 0${week.number}</span>
                    ${statusBadge}
                  </div>
                  
                  <h3 class="text-base font-bold text-[#0C1838] font-heading">
                    ${week.title}
                  </h3>

                  <p class="text-xs text-slate-500 mt-2">
                    Período: <span class="font-semibold text-slate-800">${window.appUtils.formatDateBR(week.startDate)} até ${window.appUtils.formatDateBR(week.endDate)}</span>
                  </p>
                </div>

                <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                  ${week.status === 'OPEN' ? `
                    <button 
                      onclick="triggerCloseWeek('${week.id}')"
                      class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-xs"
                    >
                      Realizar Fechamento Semanal
                    </button>
                  ` : `
                    <button 
                      onclick="triggerReopenWeek('${week.id}')"
                      class="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold py-2.5 rounded-xl transition cursor-pointer text-xs"
                    >
                      Reabrir Semana Excepcionalmente
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="card-clean p-6 space-y-4">
          <h2 class="text-base font-bold text-[#0C1838] font-heading uppercase">
            Histórico de Fechamentos Congelados
          </h2>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3">Semana</th>
                  <th class="px-4 py-3">Equipe</th>
                  <th class="px-4 py-3">Pontos Oficiais</th>
                  <th class="px-4 py-3">Bônus</th>
                  <th class="px-4 py-3">Participação</th>
                  <th class="px-4 py-3">Posição</th>
                  <th class="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${state.weeklyScoresHistory.map(hist => {
                  const week = state.weeks.find(w => w.id === hist.weekId);
                  const team = state.teams.find(t => t.id === hist.teamId);

                  return `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="px-4 py-3 font-bold text-slate-900">${week ? week.title : '-'}</td>
                      <td class="px-4 py-3 font-semibold text-slate-800">${team ? team.name : '-'}</td>
                      <td class="px-4 py-3 font-bold text-emerald-600">${hist.officialPoints} pts</td>
                      <td class="px-4 py-3 font-bold text-purple-600">+${hist.bonusPoints} pts</td>
                      <td class="px-4 py-3 font-bold">${hist.participationPercentage}%</td>
                      <td class="px-4 py-3 font-extrabold text-orange-600">${hist.rankPosition}º lugar</td>
                      <td class="px-4 py-3"><span class="badge-clean badge-navy">Congelado</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  window.triggerCloseWeek = (weekId) => {
    if (confirm('Tem certeza que deseja ENCERRAR esta semana? Novas submissões de líderes serão bloqueadas e as pontuações serão congeladas.')) {
      window.appStore.closeWeek(weekId);
      alert('✅ Fechamento concluído com sucesso!');
      renderContent();
    }
  };

  window.triggerReopenWeek = (weekId) => {
    if (confirm('Atenção: Deseja reabrir esta semana excepcionalmente?')) {
      window.appStore.reopenWeek(weekId);
      alert('🔓 Semana reaberta com sucesso.');
      renderContent();
    }
  };

  renderContent();
}
