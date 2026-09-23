// ====================================================================
// CARPEDESAFIO — ADMIN AUXILIARY VIEWS (CLEAN CARPEDIEM BRAND IDENTITY)
// ====================================================================

// 1. RULE MANAGER VIEW
function renderRuleManagerView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;

  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 mb-2">
          Configurações de Pontuação
        </div>
        <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading">
          Regras de Pontuação Configuráveis
        </h1>
        <p class="text-slate-500 text-xs mt-1">
          Altere pesos, limites de bônus e critérios de validação do sistema.
        </p>
      </div>

      <div class="card-clean p-6">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700">
            <thead class="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th class="px-4 py-3">Categoria</th>
                <th class="px-4 py-3">Pontos por Unidade</th>
                <th class="px-4 py-3">Bônus 100% Participação</th>
                <th class="px-4 py-3">Bônus Meta Batida</th>
                <th class="px-4 py-3">Exige Anexo (> Pts)</th>
                <th class="px-4 py-3">Exige Aprovação DGG (> Pts)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              ${state.missionRules.map(rule => `
                <tr class="hover:bg-slate-50 transition">
                  <td class="px-4 py-3 font-bold text-slate-900">${rule.category}</td>
                  <td class="px-4 py-3 font-bold text-orange-600">${rule.pointsPerUnit} pts</td>
                  <td class="px-4 py-3 text-purple-700 font-bold">${rule.bonus100PercentParticipation ? '+' + rule.bonus100PercentParticipation + ' pts' : '-'}</td>
                  <td class="px-4 py-3 text-emerald-700 font-bold">${rule.bonusGoalMet ? '+' + rule.bonusGoalMet + ' pts' : '-'}</td>
                  <td class="px-4 py-3 font-semibold">${rule.requiresEvidenceAbovePoints || 20} pts</td>
                  <td class="px-4 py-3 font-semibold text-red-600">${rule.requiresAdminApprovalAbovePoints || 50} pts</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 2. MISSION MANAGER VIEW
function renderMissionManagerView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;
  const user = state.currentUser;
  const isAdmin = user && user.role === 'ADMIN';

  const renderContent = () => {
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 mb-2">
              Gestão de Missões
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading">
              Missões Especiais e Missões-Relâmpago
            </h1>
          </div>

          ${isAdmin ? `
            <button 
              onclick="openCreateMissionModal()" 
              class="bg-[#EA580C] hover:bg-[#C2410C] font-bold text-white px-5 py-3 rounded-xl text-xs shadow transition cursor-pointer flex items-center justify-center gap-2"
            >
              + Criar Nova Missão
            </button>
          ` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${state.missions.length === 0 ? `
            <div class="col-span-2 text-center py-12 card-clean text-slate-400 italic">
              Nenhuma missão cadastrada no momento.
            </div>
          ` : state.missions.map(ms => {
            let statusBadge = `<span class="badge-clean badge-emerald">Aberta</span>`;
            if (ms.status === 'ENDING_SOON') statusBadge = `<span class="badge-clean badge-amber">Encerrando em breve</span>`;
            if (ms.status === 'CLOSED') statusBadge = `<span class="badge-clean badge-rose">Encerrada</span>`;

            return `
              <div class="card-clean p-5 flex flex-col justify-between space-y-4 hover:border-orange-300 transition">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2">
                      <span class="badge-clean ${ms.isBlitz ? 'badge-orange' : 'badge-navy'}">
                        ${ms.isBlitz ? 'Missão-Relâmpago' : 'Missão'}
                      </span>
                      <span class="text-xs text-slate-500 font-medium">${ms.category}</span>
                    </div>

                    <span class="font-extrabold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200 text-xs">
                      +${ms.points} pts
                    </span>
                  </div>

                  <h3 class="font-bold text-slate-900 text-base font-heading">
                    ${ms.title}
                  </h3>

                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                    ${ms.description || 'Sem descrição cadastrada.'}
                  </p>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span class="text-slate-500">Status: </span>
                    ${statusBadge}
                  </div>

                  <div class="flex items-center gap-2">
                    ${isAdmin ? `
                      <button 
                        onclick="openEditMissionModal('${ms.id}')"
                        class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded border border-slate-300 transition text-xs cursor-pointer"
                      >
                        Editar
                      </button>

                      <button 
                        onclick="triggerDeleteMission('${ms.id}', '${ms.title.replace(/'/g, "\\'")}')"
                        class="bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-3 py-1.5 rounded border border-red-200 transition text-xs cursor-pointer"
                      >
                        Excluir
                      </button>
                    ` : `
                      <button 
                        onclick="window.appInstance.openSubmitModal({ missionId: '${ms.id}', category: '${ms.category}' })"
                        class="bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold px-3 py-1.5 rounded text-xs transition cursor-pointer"
                      >
                        Participar
                      </button>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div id="mission-modal-container"></div>
    `;
  };

  window.openCreateMissionModal = () => renderMissionFormModal();
  window.openEditMissionModal = (missionId) => {
    const ms = state.missions.find(m => m.id === missionId);
    if (ms) renderMissionFormModal(ms);
  };

  window.triggerDeleteMission = (missionId, title) => {
    if (confirm(`Tem certeza que deseja EXCLUIR a missão "${title}"?`)) {
      window.appStore.deleteMission(missionId);
      alert(`Missão "${title}" foi removida.`);
      renderContent();
    }
  };

  const renderMissionFormModal = (existingMission = null) => {
    const modalContainer = document.getElementById('mission-modal-container');
    const isEdit = !!existingMission;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative my-8 animate-in fade-in zoom-in duration-150">
          
          <div class="bg-[#0C1838] px-6 py-4 flex items-center justify-between text-white">
            <div>
              <h2 class="text-base font-bold font-heading">
                ${isEdit ? 'Editar Missão' : 'Criar Nova Missão'}
              </h2>
            </div>
            <button onclick="closeMissionModal()" class="text-slate-400 hover:text-white p-2 text-lg">✕</button>
          </div>

          <form id="mission-form" class="p-6 space-y-4 text-xs text-slate-700">
            <div>
              <label class="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                Título da Missão *
              </label>
              <input 
                type="text" 
                id="mission-title" 
                required 
                placeholder="ex: Publicação de Vídeo no Instagram"
                value="${isEdit ? existingMission.title : ''}"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-bold focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label class="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                Descrição Detalhada *
              </label>
              <textarea 
                id="mission-desc" 
                rows="3" 
                required
                placeholder="Descreva o objetivo da missão..."
                class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none"
              >${isEdit ? existingMission.description : ''}</textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Categoria *
                </label>
                <select id="mission-category" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:border-orange-500">
                  <option value="Missão-relâmpago" ${isEdit && existingMission.category === 'Missão-relâmpago' ? 'selected' : ''}>Missão-relâmpago</option>
                  <option value="CarpeClub" ${isEdit && existingMission.category === 'CarpeClub' ? 'selected' : ''}>CarpeClub</option>
                  <option value="WhatsApp / Grupos" ${isEdit && existingMission.category === 'WhatsApp / Grupos' ? 'selected' : ''}>WhatsApp / Grupos</option>
                  <option value="Instagram" ${isEdit && existingMission.category === 'Instagram' ? 'selected' : ''}>Instagram</option>
                  <option value="LinkedIn" ${isEdit && existingMission.category === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
                  <option value="Status WhatsApp" ${isEdit && existingMission.category === 'Status WhatsApp' ? 'selected' : ''}>Status WhatsApp</option>
                  <option value="Ação presencial" ${isEdit && existingMission.category === 'Ação presencial' ? 'selected' : ''}>Ação presencial</option>
                </select>
              </div>

              <div>
                <label class="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Pontos *
                </label>
                <input 
                  type="number" 
                  id="mission-points" 
                  min="1" 
                  max="1000" 
                  required 
                  value="${isEdit ? existingMission.points : '20'}"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-orange-600 font-extrabold focus:border-orange-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Status *
                </label>
                <select id="mission-status" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-medium">
                  <option value="OPEN" ${isEdit && existingMission.status === 'OPEN' ? 'selected' : ''}>Aberta</option>
                  <option value="ENDING_SOON" ${isEdit && existingMission.status === 'ENDING_SOON' ? 'selected' : ''}>Encerrando em breve</option>
                  <option value="CLOSED" ${isEdit && existingMission.status === 'CLOSED' ? 'selected' : ''}>Encerrada</option>
                </select>
              </div>

              <div class="flex items-center pt-5">
                <label class="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold">
                  <input type="checkbox" id="mission-is-blitz" ${!isEdit || existingMission.isBlitz ? 'checked' : ''} class="rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                  <span>É Missão-Relâmpago?</span>
                </label>
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button type="button" onclick="closeMissionModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-semibold">
                Cancelar
              </button>
              <button type="submit" class="bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold px-6 py-2 rounded-xl shadow-md">
                ${isEdit ? 'Salvar Alterações' : 'Criar Missão'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.getElementById('mission-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('mission-title').value;
      const description = document.getElementById('mission-desc').value;
      const category = document.getElementById('mission-category').value;
      const points = Number(document.getElementById('mission-points').value);
      const status = document.getElementById('mission-status').value;
      const isBlitz = document.getElementById('mission-is-blitz').checked;

      if (isEdit) {
        window.appStore.updateMission(existingMission.id, { title, description, category, points, status, isBlitz });
        alert(`Missão "${title}" atualizada.`);
      } else {
        window.appStore.addMission({ title, description, category, points, status, isBlitz });
        alert(`Nova missão "${title}" criada.`);
      }

      closeMissionModal();
      renderContent();
    });
  };

  window.closeMissionModal = () => {
    document.getElementById('mission-modal-container').innerHTML = '';
  };

  renderContent();
}

// 3. AUDIT LOGS VIEW
function renderAuditLogsView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;

  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 mb-2">
          Logs de Auditoria
        </div>
        <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading">
          Registro de Logs do Sistema
        </h1>
      </div>

      <div class="card-clean p-6">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700">
            <thead class="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th class="px-4 py-3">Data/Hora</th>
                <th class="px-4 py-3">Usuário</th>
                <th class="px-4 py-3">Ação</th>
                <th class="px-4 py-3">Alvo</th>
                <th class="px-4 py-3">Detalhes</th>
                <th class="px-4 py-3">Justificativa</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              ${state.auditLogs.map(log => `
                <tr class="hover:bg-slate-50 transition">
                  <td class="px-4 py-3 font-mono text-slate-500">${window.appUtils.formatDateBR(log.timestamp)}</td>
                  <td class="px-4 py-3 font-bold text-slate-900">${log.userName}</td>
                  <td class="px-4 py-3 font-extrabold text-orange-600">${log.action}</td>
                  <td class="px-4 py-3 font-mono text-slate-600">${log.targetId || '-'}</td>
                  <td class="px-4 py-3">${log.details}</td>
                  <td class="px-4 py-3 text-slate-500 italic">${log.justification || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// 4. REPORTS EXPORT VIEW
function renderReportsView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;

  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 mb-2">
          Central de Exportação
        </div>
        <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading">
          Exportação de Relatórios (CSV / Excel)
        </h1>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="card-clean p-5 space-y-3">
          <h3 class="font-bold text-slate-900 text-sm">Ranking Geral</h3>
          <p class="text-xs text-slate-500">Classificação atualizada com pontuações oficiais e provisórias.</p>
          <button onclick="exportRankingCSV()" class="w-full bg-[#0C1838] hover:bg-[#1E293B] font-bold text-white py-2 rounded-lg text-xs shadow-sm transition">
            Download CSV (Excel)
          </button>
        </div>

        <div class="card-clean p-5 space-y-3">
          <h3 class="font-bold text-slate-900 text-sm">Submissões</h3>
          <p class="text-xs text-slate-500">Lista completa de todas as ações registradas.</p>
          <button onclick="exportSubmissionsCSV()" class="w-full bg-[#EA580C] hover:bg-[#C2410C] font-bold text-white py-2 rounded-lg text-xs shadow-sm transition">
            Download CSV (Excel)
          </button>
        </div>

        <div class="card-clean p-5 space-y-3">
          <h3 class="font-bold text-slate-900 text-sm">Logs de Auditoria</h3>
          <p class="text-xs text-slate-500">Histórico de auditorias e justificativas.</p>
          <button onclick="exportAuditLogsCSV()" class="w-full bg-slate-700 hover:bg-slate-800 font-bold text-white py-2 rounded-lg text-xs shadow-sm transition">
            Download CSV (Excel)
          </button>
        </div>
      </div>
    </div>
  `;

  window.exportRankingCSV = () => {
    const leaderboard = window.appStore.getLeaderboard();
    const headers = ['Posicao', 'Equipe', 'Pontos_Oficiais', 'Pontos_Provisorios', 'Participacao_Pct'];
    const rows = leaderboard.map((item, idx) => [
      `${idx + 1}º`, item.team.name, item.officialPoints, item.provisionalPoints, `${item.participationPercentage}%`
    ]);
    window.appUtils.downloadCSV('CarpeDesafio_Ranking_Geral', headers, rows);
  };

  window.exportSubmissionsCSV = () => {
    const subs = state.submissions;
    const headers = ['Codigo', 'Equipe', 'Categoria', 'Data_Acao', 'Quantidade', 'Pontos_Calculados', 'Status', 'Duplicidade'];
    const rows = subs.map(s => {
      const team = state.teams.find(t => t.id === s.teamId);
      return [s.code, team ? team.name : '-', s.category, s.actionDate, s.quantity, s.calculatedPoints, s.status, s.isPossibleDuplicate ? 'SIM' : 'NAO'];
    });
    window.appUtils.downloadCSV('CarpeDesafio_Submissoes', headers, rows);
  };

  window.exportAuditLogsCSV = () => {
    const logs = state.auditLogs;
    const headers = ['Timestamp', 'Usuario', 'Acao', 'Alvo', 'Detalhes', 'Justificativa'];
    const rows = logs.map(l => [l.timestamp, l.userName, l.action, l.targetId || '', l.details, l.justification || '']);
    window.appUtils.downloadCSV('CarpeDesafio_Logs_Auditoria', headers, rows);
  };
}

// 5. TEAMS MANAGER VIEW
function renderTeamsManagerView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;

  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 mb-2">
          Gestão de Equipes
        </div>
        <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading">
          Equipes e Integrantes Cadastrados
        </h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${state.teams.map(team => {
          const members = state.teamMembers.filter(m => m.teamId === team.id);
          const leader = state.users.find(u => u.id === team.leaderId);

          return `
            <div class="card-clean p-5 space-y-4">
              <div>
                <h3 class="text-base font-bold text-[#0C1838] font-heading">${team.name}</h3>
                <p class="text-xs text-orange-600 font-bold mt-0.5">Líder: ${leader ? leader.name : '-'}</p>
              </div>

              <div class="pt-3 border-t border-slate-100">
                <span class="text-xs font-bold text-slate-500 uppercase block mb-2">Integrantes (${members.length}):</span>
                <div class="space-y-1.5 max-h-48 overflow-y-auto">
                  ${members.map(m => `
                    <div class="flex items-center justify-between text-xs bg-slate-50 p-2 rounded border border-slate-200">
                      <span class="font-medium text-slate-800">${m.name}</span>
                      <span class="text-[10px] text-slate-500">${m.role}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// 6. HISTORY VIEW
function renderHistoryView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;

  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-200 mb-2">
          Histórico de Desempenho
        </div>
        <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading">
          Evolução Semanal das Equipes
        </h1>
      </div>

      <div class="card-clean p-6">
        <table class="w-full text-left text-xs text-slate-700">
          <thead class="bg-slate-50 text-slate-500 font-bold uppercase">
            <tr>
              <th class="px-4 py-3">Semana</th>
              <th class="px-4 py-3">Equipe</th>
              <th class="px-4 py-3">Pontos Acumulados</th>
              <th class="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            ${state.weeklyScoresHistory.map(h => {
              const week = state.weeks.find(w => w.id === h.weekId);
              const team = state.teams.find(t => t.id === h.teamId);
              return `
                <tr>
                  <td class="px-4 py-3 font-bold text-slate-900">${week ? week.title : '-'}</td>
                  <td class="px-4 py-3 font-semibold text-slate-800">${team ? team.name : '-'}</td>
                  <td class="px-4 py-3 font-bold text-emerald-600">${h.officialPoints} pts</td>
                  <td class="px-4 py-3"><span class="badge-clean badge-navy">Congelado</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// 7. MY TEAM VIEW (LEADER)
function renderMyTeamView(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;
  const user = state.currentUser;
  const team = state.teams.find(t => t.id === user.teamId);
  if (!team) return;

  const members = state.teamMembers.filter(m => m.teamId === team.id);

  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-200 mb-2">
          Minha Equipe
        </div>
        <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading">
          ${team.name}
        </h1>
        <p class="text-slate-500 text-xs mt-1">
          Total de ${members.length} integrantes vinculados a esta equipe.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        ${members.map(m => `
          <div class="card-clean p-4 flex items-center justify-between">
            <div>
              <div class="font-bold text-slate-900 text-sm">${m.name}</div>
              <div class="text-xs text-slate-500">${m.role}</div>
            </div>
            <span class="badge-clean badge-emerald">Ativo</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
