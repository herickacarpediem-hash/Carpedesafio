// ====================================================================
// CARPEDESAFIO — LEADER DASHBOARD (CLEAN CARPEDIEM BRAND IDENTITY)
// ====================================================================

function renderLeaderDashboard(containerId, onOpenSubmitModal) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const state = window.appStore.state;
  const user = state.currentUser;
  const team = state.teams.find(t => t.id === user.teamId);
  if (!team) return;

  const teamStats = window.appStore.getTeamScoreStats(team.id);
  const leaderboard = window.appStore.getLeaderboard();
  const positionIndex = leaderboard.findIndex(item => item.team.id === team.id);
  const positionNumber = positionIndex >= 0 ? positionIndex + 1 : 1;
  const rankLabel = positionNumber === 1 ? '1º lugar' : positionNumber === 2 ? '2º lugar' : '3º lugar';

  // Target Goal Calculation
  const totalMembers = teamStats.totalMembersCount;
  const targetWeeklyActions = totalMembers * (team.weeklyGoalMultiplier || 3);
  const goalPercent = Math.min(100, Math.round((teamStats.totalActions / targetWeeklyActions) * 100));

  // 1. Blitz Missions
  const blitzMissions = state.missions.filter(m => m.status !== 'CLOSED');

  // 2. Weekly Core Missions
  const weeklyMissions = [
    { id: 'w-carpeclub', title: 'Votação no CarpeClub', category: 'CarpeClub', points: 5, description: 'Registrar engajamento e voto da equipe no portal CarpeClub.' },
    { id: 'w-whatsapp', title: 'Divulgação em Grupos WhatsApp', category: 'WhatsApp / Grupos', points: 5, description: 'Compartilhar banner em grupos com clientes e parceiros autorizados.' },
    { id: 'w-instagram', title: 'Postagem no Instagram', category: 'Instagram', points: 10, description: 'Publicar card da campanha no feed ou stories do Instagram.' },
    { id: 'w-linkedin', title: 'Publicação no LinkedIn', category: 'LinkedIn', points: 10, description: 'Publicar conteúdo sobre a campanha no perfil do LinkedIn.' },
    { id: 'w-status-wa', title: 'Status no WhatsApp', category: 'Status WhatsApp', points: 5, description: 'Atualizar status do WhatsApp divulgando o link de votação.' },
    { id: 'w-presencial', title: 'Ação Presencial / Atendimento', category: 'Ação presencial', points: 20, description: 'Incentivo presencial com hospedes ou clientes no empreendimento.' },
    { id: 'w-outra', title: 'Outra Ação Autorizada', category: 'Outra ação autorizada', points: 5, description: 'Ações gerais de mobilização autorizadas pela liderança.' }
  ];

  const mySubmissions = state.submissions.filter(s => s.teamId === team.id);

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Clean Executive Scoreboard Header -->
      <div class="card-clean p-6 border-l-4 border-l-[#EA580C]">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-block text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-200 mb-2">
              CarpeDesafio — Prêmio Reclame AQUI
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-[#0C1838] font-heading tracking-tight">
              ${team.name}
            </h1>
            <p class="text-slate-500 text-xs mt-1">
              Líder responsável: <span class="text-slate-900 font-semibold">${user.name}</span> • <span class="text-emerald-600 font-semibold">${totalMembers} integrantes vinculados</span>
            </p>
          </div>

          <!-- Score Metrics Row -->
          <div class="grid grid-cols-3 gap-3 text-xs">
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span class="text-slate-500 block font-semibold text-[10px] uppercase">Pontos Atuais</span>
              <span class="text-2xl font-black text-[#EA580C] font-heading">${teamStats.provisionalPoints}</span>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span class="text-slate-500 block font-semibold text-[10px] uppercase">Classificação</span>
              <span class="text-lg font-black text-[#0C1838] font-heading">${rankLabel}</span>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span class="text-slate-500 block font-semibold text-[10px] uppercase">Participação</span>
              <span class="text-lg font-black text-emerald-600 font-heading">${teamStats.participationPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 1: MISSÕES RELÂMPAGO -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-[#0C1838] font-heading tracking-tight uppercase">
            Missões Relâmpago Ativas
          </h2>
          <span class="text-xs text-slate-500 font-medium">Pontuação adicional por tempo limitado</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${blitzMissions.length === 0 ? `
            <div class="col-span-2 text-center py-6 card-clean text-slate-500 text-xs italic">
              Nenhuma missão-relâmpago ativa no momento.
            </div>
          ` : blitzMissions.map(ms => `
            <div class="card-clean p-5 flex flex-col justify-between space-y-4 hover:border-orange-300 transition">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="badge-clean badge-orange">Missão-Relâmpago</span>
                  <span class="font-extrabold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200 text-xs">
                    +${ms.points} pontos
                  </span>
                </div>

                <h3 class="font-bold text-slate-900 text-sm font-heading">
                  ${ms.title}
                </h3>
                <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                  ${ms.description}
                </p>
              </div>

              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span class="text-slate-500">
                  Status: <strong class="text-emerald-600 font-semibold">${ms.status === 'OPEN' ? 'Aberta' : 'Encerrando'}</strong>
                </span>

                <button 
                  onclick="openDirectProofModal('${ms.id}', '${ms.title.replace(/'/g, "\\'")}', '${ms.category}', ${ms.points})"
                  class="bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold px-4 py-2 rounded-lg transition cursor-pointer text-xs shadow-sm"
                >
                  Enviar Comprovação
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 2: MISSÕES DA SEMANA (ROTINA) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-[#0C1838] font-heading tracking-tight uppercase">
            Missões da Semana
          </h2>
          <span class="text-xs text-slate-500 font-medium">Clique em uma missão para registrar a comprovação</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${weeklyMissions.map(ms => `
            <div class="card-clean p-4 flex flex-col justify-between space-y-3 hover:border-orange-300 transition">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">${ms.category}</span>
                  <span class="font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-xs">
                    +${ms.points} pts
                  </span>
                </div>

                <h3 class="font-bold text-slate-900 text-xs font-heading">
                  ${ms.title}
                </h3>
                <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  ${ms.description}
                </p>
              </div>

              <div class="pt-3 border-t border-slate-100">
                <button 
                  onclick="openDirectProofModal('${ms.id}', '${ms.title.replace(/'/g, "\\'")}', '${ms.category}', ${ms.points})"
                  class="w-full bg-slate-100 hover:bg-[#EA580C] hover:text-white text-slate-800 font-bold py-2 rounded-lg transition cursor-pointer text-xs border border-slate-200"
                >
                  Enviar Comprovação
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 3: SUBMISSÕES DA EQUIPE -->
      <div class="card-clean p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-bold text-[#0C1838] font-heading uppercase">
            Submissões Registradas pela Equipe
          </h2>
          <span class="text-xs text-slate-500">Total: ${mySubmissions.length} enviadas</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-700">
            <thead class="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th class="px-4 py-3">Código</th>
                <th class="px-4 py-3">Categoria</th>
                <th class="px-4 py-3">Data</th>
                <th class="px-4 py-3">Qtd</th>
                <th class="px-4 py-3">Pontos</th>
                <th class="px-4 py-3">Comprovação</th>
                <th class="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              ${mySubmissions.length === 0 ? `
                <tr>
                  <td colspan="7" class="text-center py-8 text-slate-400 italic">
                    Nenhuma ação registrada por enquanto. Escolha uma das missões acima e clique em "Enviar Comprovação"!
                  </td>
                </tr>
              ` : mySubmissions.map(sub => {
                let statusBadge = `<span class="badge-clean badge-amber">Pendente</span>`;
                if (sub.status === 'APPROVED') statusBadge = `<span class="badge-clean badge-emerald">Aprovada</span>`;
                if (sub.status === 'REJECTED') statusBadge = `<span class="badge-clean badge-rose">Reprovada</span>`;
                if (sub.isPossibleDuplicate) statusBadge = `<span class="badge-clean badge-rose">Duplicidade</span>`;

                return `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="px-4 py-3 font-mono font-bold text-slate-900">${sub.code}</td>
                    <td class="px-4 py-3 font-semibold text-slate-800">${sub.category}</td>
                    <td class="px-4 py-3 text-slate-500">${window.appUtils.formatDateBR(sub.actionDate)}</td>
                    <td class="px-4 py-3 font-semibold">${sub.quantity}</td>
                    <td class="px-4 py-3 font-bold text-orange-600">+${sub.calculatedPoints} pts</td>
                    <td class="px-4 py-3">
                      ${sub.evidenceFiles && sub.evidenceFiles.length > 0 ? `
                        <a href="${sub.evidenceFiles[0].fileUrl}" target="_blank" class="text-blue-600 hover:underline font-semibold">
                          Ver Anexo (${sub.evidenceFiles.length})
                        </a>
                      ` : '<span class="text-slate-400">Sem anexo</span>'}
                    </td>
                    <td class="px-4 py-3">${statusBadge}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Container for Direct Proof Submission Modal -->
      <div id="direct-proof-modal-container"></div>
    </div>
  `;

  // Direct Submission Modal Trigger
  window.openDirectProofModal = (missionId, title, category, basePoints) => {
    const modalContainer = document.getElementById('direct-proof-modal-container');
    let attachedFiles = [];

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative my-8 animate-in fade-in zoom-in duration-150">
          
          <!-- Modal Header -->
          <div class="bg-[#0C1838] px-6 py-4 flex items-center justify-between text-white">
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                Envio de Comprovação
              </div>
              <h2 class="text-base font-bold text-white font-heading mt-0.5">
                ${title}
              </h2>
            </div>

            <button 
              onclick="closeDirectModal()"
              class="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition text-lg cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Form Body -->
          <form id="direct-proof-form" class="p-6 space-y-4 text-xs text-slate-700">
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-slate-600">
              <span>Equipe: <strong class="text-slate-900">${team.name}</strong></span>
              <span class="text-orange-600 font-bold">+${basePoints} pts por unidade</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Data da Ação *
                </label>
                <input 
                  type="date" 
                  id="direct-date" 
                  required 
                  value="${new Date().toISOString().split('T')[0]}"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-medium focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Quantidade *
                </label>
                <input 
                  type="number" 
                  id="direct-quantity" 
                  min="1" 
                  max="500" 
                  value="1" 
                  required 
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-bold text-orange-600 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                Descrição / Observações (Opcional)
              </label>
              <textarea 
                id="direct-description" 
                rows="2" 
                placeholder="Informe detalhes da ação realizada..." 
                class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none"
              ></textarea>
            </div>

            <!-- Evidence Dropzone -->
            <div>
              <label class="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                Anexar Comprovação (Prints/Vídeos/PDF) *
              </label>
              <div 
                id="direct-dropzone" 
                class="border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/50 rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1"
              >
                <span class="text-xl text-orange-600">📎</span>
                <p class="font-medium text-slate-700 text-xs">
                  Arraste arquivos aqui ou <span class="text-orange-600 underline font-bold">clique para selecionar</span>
                </p>
                <input type="file" id="direct-file-input" multiple accept="image/*,video/*,application/pdf" class="hidden" />
              </div>
              <div id="direct-files-preview" class="mt-2 space-y-1"></div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button 
                type="button" 
                onclick="closeDirectModal()" 
                class="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-100 transition cursor-pointer text-xs"
              >
                Cancelar
              </button>

              <button 
                type="submit" 
                id="direct-submit-btn"
                class="bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer text-xs"
              >
                Enviar Comprovação
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    const dropzone = document.getElementById('direct-dropzone');
    const fileInput = document.getElementById('direct-file-input');
    const previewContainer = document.getElementById('direct-files-preview');

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      for (const f of files) {
        const hash = await window.appUtils.computeFileHash(f);
        attachedFiles.push({
          id: 'file-' + Date.now() + Math.random().toString(36).substring(2, 4),
          fileName: f.name,
          fileSize: f.size,
          fileType: f.type,
          fileUrl: URL.createObjectURL(f),
          fileHash: hash
        });
      }
      renderPreview();
    });

    const renderPreview = () => {
      previewContainer.innerHTML = attachedFiles.map((file, idx) => `
        <div class="flex items-center justify-between bg-slate-100 p-2 rounded-lg text-xs">
          <span class="truncate text-slate-800">📄 ${file.fileName}</span>
          <button type="button" onclick="removeDirectFile(${idx})" class="text-red-600 font-bold px-2">✕</button>
        </div>
      `).join('');
    };

    window.removeDirectFile = (idx) => {
      attachedFiles.splice(idx, 1);
      renderPreview();
    };

    window.closeDirectModal = () => {
      modalContainer.innerHTML = '';
    };

    document.getElementById('direct-proof-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      if (attachedFiles.length === 0) {
        alert('É obrigatório anexar pelo menos um arquivo de comprovação.');
        return;
      }

      const actionDate = document.getElementById('direct-date').value;
      const quantity = parseInt(document.getElementById('direct-quantity').value) || 1;
      const description = document.getElementById('direct-description').value;

      const submitBtn = document.getElementById('direct-submit-btn');
      submitBtn.innerText = 'Enviando...';
      submitBtn.disabled = true;

      try {
        const newSub = await window.appStore.submitAction({
          category,
          missionId: missionId.startsWith('ms-') ? missionId : null,
          actionDate,
          quantity,
          description,
          evidenceFiles: attachedFiles
        });

        window.appUtils.triggerConfetti();

        alert(`✅ Comprovação enviada com sucesso para a ${team.name}!\n\nCódigo: ${newSub.code}\nPontos Provisórios: +${newSub.calculatedPoints} pts`);
        
        closeDirectModal();
        renderLeaderDashboard(containerId, onOpenSubmitModal);
      } catch (err) {
        alert(`Erro ao enviar comprovação: ${err.message}`);
        submitBtn.innerText = 'Enviar Comprovação';
        submitBtn.disabled = false;
      }
    });
  };
}
