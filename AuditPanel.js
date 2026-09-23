// ====================================================================
// CARPEDESAFIO — AUDIT PANEL (CLEAN CARPEDIEM BRAND IDENTITY)
// ====================================================================

function renderAuditPanel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;
  let activeFilterTeam = 'ALL';
  let activeFilterStatus = 'ALL';
  let activeFilterCategory = 'ALL';
  let activeFilterDuplicateOnly = false;

  const renderContent = () => {
    let list = [...state.submissions];

    if (activeFilterTeam !== 'ALL') {
      list = list.filter(s => s.teamId === activeFilterTeam);
    }
    if (activeFilterStatus !== 'ALL') {
      list = list.filter(s => s.status === activeFilterStatus);
    }
    if (activeFilterCategory !== 'ALL') {
      list = list.filter(s => s.category === activeFilterCategory);
    }
    if (activeFilterDuplicateOnly) {
      list = list.filter(s => s.isPossibleDuplicate);
    }

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 mb-2">
              Módulo de Auditoria DGG
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading">
              Painel de Auditoria de Submissões
            </h1>
            <p class="text-slate-500 text-xs mt-1">
              Validação de comprovações, pontuações e detecção de duplicidades.
            </p>
          </div>
        </div>

        <!-- Filter Bar -->
        <div class="card-clean p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 uppercase mb-1">Filtrar por Equipe</label>
            <select id="filter-team" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900">
              <option value="ALL">Todas as Equipes</option>
              ${state.teams.map(t => `<option value="${t.id}" ${activeFilterTeam === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 uppercase mb-1">Status da Submissão</label>
            <select id="filter-status" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900">
              <option value="ALL">Todos os Status</option>
              <option value="PENDING" ${activeFilterStatus === 'PENDING' ? 'selected' : ''}>Pendente de Validação</option>
              <option value="APPROVED" ${activeFilterStatus === 'APPROVED' ? 'selected' : ''}>Aprovada (Oficial)</option>
              <option value="REJECTED" ${activeFilterStatus === 'REJECTED' ? 'selected' : ''}>Reprovada</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 uppercase mb-1">Categoria</label>
            <select id="filter-category" class="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900">
              <option value="ALL">Todas as Categorias</option>
              <option value="CarpeClub">CarpeClub</option>
              <option value="WhatsApp / Grupos">WhatsApp / Grupos</option>
              <option value="Instagram">Instagram</option>
              <option value="Missão-relâmpago">Missão-relâmpago</option>
              <option value="Ação presencial">Ação presencial</option>
            </select>
          </div>

          <div class="flex items-end">
            <label class="flex items-center gap-2 p-2 bg-slate-50 border border-slate-300 rounded-lg w-full cursor-pointer hover:bg-slate-100">
              <input type="checkbox" id="filter-duplicity" ${activeFilterDuplicateOnly ? 'checked' : ''} class="rounded border-slate-300 text-red-600 focus:ring-red-500" />
              <span class="font-bold text-red-600">Somente Duplicidades</span>
            </label>
          </div>
        </div>

        <!-- Audit Table -->
        <div class="card-clean overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3.5">Código</th>
                  <th class="px-4 py-3.5">Equipe</th>
                  <th class="px-4 py-3.5">Líder</th>
                  <th class="px-4 py-3.5">Categoria</th>
                  <th class="px-4 py-3.5">Data</th>
                  <th class="px-4 py-3.5">Qtd</th>
                  <th class="px-4 py-3.5">Pontos Calc.</th>
                  <th class="px-4 py-3.5">Status</th>
                  <th class="px-4 py-3.5 text-center">Ação</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${list.length === 0 ? `
                  <tr>
                    <td colspan="9" class="text-center py-12 text-slate-400 italic">
                      Nenhuma submissão encontrada com os filtros selecionados.
                    </td>
                  </tr>
                ` : list.map(sub => {
                  const team = state.teams.find(t => t.id === sub.teamId);
                  const leader = state.users.find(u => u.id === sub.leaderId);

                  let statusBadge = `<span class="badge-clean badge-amber">Pendente</span>`;
                  if (sub.status === 'APPROVED') statusBadge = `<span class="badge-clean badge-emerald">Aprovada</span>`;
                  if (sub.status === 'REJECTED') statusBadge = `<span class="badge-clean badge-rose">Reprovada</span>`;
                  if (sub.isPossibleDuplicate) statusBadge = `<span class="badge-clean badge-rose">Duplicidade</span>`;

                  return `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="px-4 py-3 font-mono font-bold text-slate-900">${sub.code}</td>
                      <td class="px-4 py-3 font-semibold text-slate-800">${team ? team.name : '-'}</td>
                      <td class="px-4 py-3 text-slate-500">${leader ? leader.name : '-'}</td>
                      <td class="px-4 py-3 font-medium text-slate-700">${sub.category}</td>
                      <td class="px-4 py-3 text-slate-500">${window.appUtils.formatDateBR(sub.actionDate)}</td>
                      <td class="px-4 py-3 font-semibold">${sub.quantity}</td>
                      <td class="px-4 py-3 font-bold text-orange-600">+${sub.calculatedPoints} pts</td>
                      <td class="px-4 py-3">${statusBadge}</td>
                      <td class="px-4 py-3 text-center">
                        <button 
                          onclick="openAuditDetailModal('${sub.id}')"
                          class="bg-[#0C1838] hover:bg-[#1E293B] text-white font-bold px-3 py-1.5 rounded border border-slate-700 transition text-[11px] cursor-pointer"
                        >
                          Auditar
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Detail Audit Modal Container -->
      <div id="audit-modal-container"></div>
    `;

    document.getElementById('filter-team').addEventListener('change', (e) => {
      activeFilterTeam = e.target.value;
      renderContent();
    });
    document.getElementById('filter-status').addEventListener('change', (e) => {
      activeFilterStatus = e.target.value;
      renderContent();
    });
    document.getElementById('filter-category').addEventListener('change', (e) => {
      activeFilterCategory = e.target.value;
      renderContent();
    });
    document.getElementById('filter-duplicity').addEventListener('change', (e) => {
      activeFilterDuplicateOnly = e.target.checked;
      renderContent();
    });
  };

  window.openAuditDetailModal = (subId) => {
    const sub = state.submissions.find(s => s.id === subId);
    if (!sub) return;
    renderDetailModal(sub);
  };

  const renderDetailModal = (sub) => {
    const modalContainer = document.getElementById('audit-modal-container');
    const team = state.teams.find(t => t.id === sub.teamId);
    const leader = state.users.find(u => u.id === sub.leaderId);

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative my-8 animate-in fade-in zoom-in duration-150">
          
          <div class="bg-[#0C1838] px-6 py-4 border-b border-slate-800 flex items-center justify-between text-white">
            <div>
              <h2 class="text-base font-bold font-heading">
                Auditoria de Submissão: <span class="text-orange-400 font-mono">${sub.code}</span>
              </h2>
              <p class="text-xs text-slate-300">
                Líder ${leader ? leader.name : '-'} (${team ? team.name : '-'}) em ${window.appUtils.formatDateBR(sub.createdAt)}
              </p>
            </div>

            <button onclick="closeAuditModal()" class="text-slate-400 hover:text-white p-2 rounded-lg text-lg cursor-pointer">
              ✕
            </button>
          </div>

          <div class="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
            ${sub.isPossibleDuplicate ? `
              <div class="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700">
                <strong class="font-bold">Alerta de Duplicidade:</strong> ${sub.duplicateReason || 'Possível envio duplicado detectado.'}
              </div>
            ` : ''}

            <div class="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">CATEGORIA:</span>
                <span class="text-slate-900 font-bold text-xs">${sub.category}</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">QUANTIDADE:</span>
                <span class="text-slate-900 font-bold text-xs">${sub.quantity}</span>
              </div>
              <div>
                <span class="text-slate-500 font-bold block text-[10px] uppercase">PONTOS:</span>
                <span class="text-orange-600 font-black text-sm">+${sub.calculatedPoints} pts</span>
              </div>
            </div>

            <div>
              <h4 class="font-bold text-slate-700 uppercase mb-1">Descrição:</h4>
              <p class="bg-slate-50 p-3 rounded-xl text-slate-800 border border-slate-200 italic">
                ${sub.description || 'Nenhuma observação informada.'}
              </p>
            </div>

            <div>
              <h4 class="font-bold text-slate-700 uppercase mb-2">Comprovações Anexadas:</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${sub.evidenceFiles && sub.evidenceFiles.length > 0 ? sub.evidenceFiles.map(ev => `
                  <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
                    <div class="flex items-center justify-between font-semibold text-slate-900 mb-2">
                      <span class="truncate">📄 ${ev.fileName}</span>
                      <a href="${ev.fileUrl}" target="_blank" class="text-blue-600 hover:underline text-[11px]">Abrir original</a>
                    </div>
                    <div class="w-full h-32 bg-slate-200 rounded overflow-hidden mb-2">
                      <img src="${ev.fileUrl}" alt="Proof" class="object-cover w-full h-full" onerror="this.src='https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80'" />
                    </div>
                    <div class="text-[9px] font-mono text-slate-400 truncate">
                      HASH: ${ev.fileHash}
                    </div>
                  </div>
                `).join('') : '<p class="text-slate-400 italic">Nenhuma comprovação enviada.</p>'}
              </div>
            </div>

            ${sub.rejectionReason ? `
              <div class="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700">
                <strong>Motivo da Reprovação:</strong> ${sub.rejectionReason}
              </div>
            ` : ''}

            <!-- AUDIT DECISION ACTIONS -->
            <div class="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button 
                onclick="handleAuditOverrideScore('${sub.id}')"
                class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-300 transition cursor-pointer text-xs"
              >
                Alterar Pontuação
              </button>

              <div class="flex items-center gap-2">
                <button 
                  onclick="handleAuditReject('${sub.id}')"
                  class="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl border border-red-200 transition cursor-pointer text-xs"
                >
                  Reprovar
                </button>

                <button 
                  onclick="handleAuditApprove('${sub.id}')"
                  class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl transition cursor-pointer text-xs shadow-sm"
                >
                  Aprovar (Oficial)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  window.closeAuditModal = () => {
    document.getElementById('audit-modal-container').innerHTML = '';
  };

  window.handleAuditApprove = (subId) => {
    window.appStore.approveSubmission(subId);
    alert('✅ Submissão APROVADA com sucesso!');
    closeAuditModal();
    renderContent();
  };

  window.handleAuditReject = (subId) => {
    const reason = prompt('Informe a justificativa/motivo da REPROVAÇÃO:');
    if (!reason || reason.trim().length === 0) {
      alert('É obrigatório informar o motivo da reprovação.');
      return;
    }
    window.appStore.rejectSubmission(subId, reason);
    alert('🔴 Submissão REPROVADA.');
    closeAuditModal();
    renderContent();
  };

  window.handleAuditOverrideScore = (subId) => {
    const newScore = prompt('Digite a nova pontuação desejada:');
    if (!newScore || isNaN(newScore)) return;

    const justification = prompt('Digite a justificativa obrigatória para alteração manual:');
    if (!justification || justification.trim().length === 0) {
      alert('A justificativa é obrigatória.');
      return;
    }

    window.appStore.overrideScore(subId, Number(newScore), justification);
    alert(`✏️ Pontuação alterada para ${newScore} pts com registro no log.`);
    closeAuditModal();
    renderContent();
  };

  renderContent();
}
