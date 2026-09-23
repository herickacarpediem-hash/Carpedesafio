// ====================================================================
// CARPEDESAFIO — STREAMLINED ACTION REGISTRATION MODAL
// Select mission from cards (Weekly vs Blitz) & Auto-bind team members
// ====================================================================

function renderSubmitActionModal(modalContainerId, prefillData = {}, onClose, onSuccess) {
  const container = document.getElementById(modalContainerId);
  if (!container) return;

  const state = window.appStore.state;
  const user = state.currentUser;
  const team = state.teams.find(t => t.id === user.teamId);
  if (!team) return;

  const teamMembers = state.teamMembers.filter(m => m.teamId === team.id && m.active);

  // Standard weekly category options as default missions
  const weeklyMissions = [
    { id: 'w-carpeclub', title: '🎯 Votação / Engajamento no CarpeClub', category: 'CarpeClub', points: 5, description: 'Registrar participação da equipe no portal oficial CarpeClub.' },
    { id: 'w-whatsapp', title: '💬 Divulgação em Grupos de WhatsApp', category: 'WhatsApp / Grupos', points: 5, description: 'Envio de cards de votação em grupos com clientes e parceiros.' },
    { id: 'w-instagram', title: '📸 Publicação no Feed ou Stories do Instagram', category: 'Instagram', points: 10, description: 'Postagem oficial divulgando o Prêmio Reclame AQUI no Instagram.' },
    { id: 'w-linkedin', title: '💼 Publicação no LinkedIn', category: 'LinkedIn', points: 10, description: 'Postagem institucional divulgando a campanha no LinkedIn.' },
    { id: 'w-status-wa', title: '📱 Atualização de Status no WhatsApp', category: 'Status WhatsApp', points: 5, description: 'Postagem nos status do WhatsApp dos integrantes da equipe.' },
    { id: 'w-presencial', title: '🤝 Ação Presencial / Atendimento com Hospede', category: 'Ação presencial', points: 20, description: 'Incentivo presencial de votação com hospedes/clientes.' },
    { id: 'w-outra', title: '✨ Outra Ação Autorizada', category: 'Outra ação autorizada', points: 5, description: 'Qualquer outra ação de mobilização autorizada pela liderança.' }
  ];

  const blitzMissions = state.missions.filter(m => m.status !== 'CLOSED');

  let activeTab = prefillData.isBlitz ? 'BLITZ' : 'WEEKLY';
  
  // Default selected mission
  let selectedMission = prefillData.missionId 
    ? (blitzMissions.find(m => m.id === prefillData.missionId) || weeklyMissions[0])
    : weeklyMissions[0];

  let attachedFiles = [];

  const renderModalContent = () => {
    container.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <div class="bg-[#111827] border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden relative my-8 animate-in fade-in zoom-in duration-200">
          
          <!-- Modal Header -->
          <div class="bg-[#1E293B] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xl">
                ⚡
              </div>
              <div>
                <h2 class="text-lg font-bold text-white font-heading">
                  REGISTRAR AÇÃO — <span class="text-amber-400 font-mono">${team.name}</span>
                </h2>
                <p class="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                  <span>👥</span> Todos os ${teamMembers.length} integrantes vinculados automaticamente!
                </p>
              </div>
            </div>

            <button 
              onclick="closeActionModal()"
              class="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <!-- Form Body -->
          <form id="action-form" class="p-6 space-y-6 text-xs text-slate-300">
            
            <!-- STEP 1: MISSION CATEGORY TAB SELECTOR -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="font-extrabold uppercase tracking-wider text-slate-300 text-xs">
                  1. Escolha a Missão que Deseja Registrar:
                </label>
                <span class="text-[11px] text-amber-400 font-medium">Clique no card para selecionar</span>
              </div>

              <!-- Tabs -->
              <div class="flex items-center gap-2 bg-[#1E293B] p-1.5 rounded-xl border border-slate-800">
                <button 
                  type="button" 
                  id="tab-weekly-btn"
                  class="flex-1 py-2 rounded-lg font-bold transition text-xs cursor-pointer ${
                    activeTab === 'WEEKLY' 
                      ? 'bg-amber-500 text-slate-950 shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }"
                >
                  🎯 Missões da Semana (${weeklyMissions.length})
                </button>

                <button 
                  type="button" 
                  id="tab-blitz-btn"
                  class="flex-1 py-2 rounded-lg font-bold transition text-xs cursor-pointer ${
                    activeTab === 'BLITZ' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }"
                >
                  ⚡ Missões-Relâmpago (${blitzMissions.length})
                </button>
              </div>

              <!-- Mission Cards Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                ${(activeTab === 'WEEKLY' ? weeklyMissions : blitzMissions).map(ms => {
                  const isSelected = selectedMission && selectedMission.id === ms.id;
                  const borderStyle = isSelected 
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500' 
                    : 'border-slate-800 bg-[#1E293B] hover:border-slate-700';

                  return `
                    <div 
                      onclick="selectMissionCard('${ms.id}')"
                      class="p-3 rounded-xl border cursor-pointer transition ${borderStyle} flex flex-col justify-between"
                    >
                      <div class="flex items-start justify-between gap-2 mb-1">
                        <span class="font-bold text-white text-xs truncate font-heading">${ms.title}</span>
                        <span class="font-extrabold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full text-[11px] shrink-0">
                          +${ms.points} pts
                        </span>
                      </div>
                      <p class="text-[10px] text-slate-400 line-clamp-2">${ms.description}</p>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- STEP 2: ACTION DETAILS (DATE & QUANTITY) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#1E293B] p-4 rounded-xl border border-slate-800">
              <div>
                <label class="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Data da Realização *
                </label>
                <input 
                  type="date" 
                  id="action-date" 
                  required 
                  value="${new Date().toISOString().split('T')[0]}"
                  class="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2.5 text-white font-medium focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Quantidade Realizada * (ex: Grupos/Posts)
                </label>
                <input 
                  type="number" 
                  id="action-quantity" 
                  min="1" 
                  max="500" 
                  value="1" 
                  required 
                  class="w-full bg-[#111827] border border-slate-700 rounded-xl px-3 py-2.5 text-white font-black text-amber-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- STEP 3: OPTIONAL DESCRIPTION -->
            <div>
              <label class="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Descrição ou Observações (Opcional)
              </label>
              <textarea 
                id="action-description" 
                rows="2" 
                placeholder="Informe detalhes sobre a ação ou grupos onde o banner foi enviado..." 
                class="w-full bg-[#1E293B] border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              ></textarea>
            </div>

            <!-- STEP 4: EVIDENCE FILE UPLOAD -->
            <div>
              <label class="block font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Anexar Comprovação (Prints, Vídeos, Documentos PDF) *
              </label>
              
              <div 
                id="dropzone" 
                class="border-2 border-dashed border-slate-700 hover:border-amber-500 bg-[#1E293B]/40 hover:bg-[#1E293B] rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5"
              >
                <span class="text-2xl text-amber-400">📎</span>
                <p class="font-medium text-slate-200 text-xs">
                  Arraste os comprovantes aqui ou <span class="text-amber-400 underline font-bold">clique para selecionar</span>
                </p>
                <p class="text-[10px] text-slate-400">
                  Formatos aceitos: JPG, PNG, PDF, MP4, MOV (Múltiplos arquivos permitidos)
                </p>
                <input 
                  type="file" 
                  id="file-input" 
                  multiple 
                  accept="image/*,video/*,application/pdf" 
                  class="hidden" 
                />
              </div>

              <!-- Attached Files Preview List -->
              <div id="attached-files-list" class="mt-2 space-y-2"></div>
            </div>

            <!-- DYNAMIC POINT CALCULATION BREAKDOWN -->
            <div class="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-amber-500/15 border border-amber-500/40 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div class="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  ⚡ Pontuação Calculada Automatizada
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5">
                  Missão selecionada: <strong class="text-white">${selectedMission ? selectedMission.title : '-'}</strong>
                </div>
              </div>
              
              <div class="text-right">
                <div id="live-points-display" class="text-3xl font-black text-amber-400 font-heading">
                  0 <span class="text-sm font-normal text-slate-400">pts</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button 
                type="button" 
                onclick="closeActionModal()" 
                class="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                Cancelar
              </button>

              <button 
                type="submit" 
                id="submit-btn"
                class="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm px-8 py-3 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                ENVIAR COMPROVAÇÃO
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Tab buttons handler
    document.getElementById('tab-weekly-btn').addEventListener('click', () => {
      activeTab = 'WEEKLY';
      selectedMission = weeklyMissions[0];
      renderModalContent();
    });

    document.getElementById('tab-blitz-btn').addEventListener('click', () => {
      activeTab = 'BLITZ';
      selectedMission = blitzMissions[0] || weeklyMissions[0];
      renderModalContent();
    });

    // Dropzone logic
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const filesList = document.getElementById('attached-files-list');

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
      renderFilesPreview();
    });

    const renderFilesPreview = () => {
      filesList.innerHTML = attachedFiles.map((file, idx) => `
        <div class="flex items-center justify-between bg-[#1E293B] border border-slate-700 rounded-lg p-2 text-xs">
          <div class="flex items-center gap-2 truncate">
            <span>📄</span>
            <span class="font-semibold text-slate-200 truncate">${file.fileName}</span>
            <span class="text-[10px] text-slate-500">(${Math.round(file.fileSize / 1024)} KB)</span>
          </div>
          <button 
            type="button" 
            onclick="removeAttachedFile(${idx})" 
            class="text-rose-400 hover:text-rose-300 font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      `).join('');
    };

    window.removeAttachedFile = (idx) => {
      attachedFiles.splice(idx, 1);
      renderFilesPreview();
    };

    // Form submission handler
    document.getElementById('action-form').addEventListener('submit', async (e) => {
      e.preventDefault();

      if (attachedFiles.length === 0) {
        alert('É obrigatório anexar pelo menos um arquivo de comprovação (print, vídeo ou PDF).');
        return;
      }

      if (!selectedMission) {
        alert('Selecione uma missão para registrar.');
        return;
      }

      const actionDate = document.getElementById('action-date').value;
      const quantity = parseInt(document.getElementById('action-quantity').value) || 1;
      const description = document.getElementById('action-description').value;

      const submitBtn = document.getElementById('submit-btn');
      submitBtn.innerText = 'ENVIANDO E PROCESSANDO...';
      submitBtn.disabled = true;

      try {
        const newSub = await window.appStore.submitAction({
          category: selectedMission.category || 'Missão-relâmpago',
          missionId: selectedMission.id.startsWith('ms-') ? selectedMission.id : null,
          actionDate,
          quantity,
          description,
          evidenceFiles: attachedFiles
        });

        window.appUtils.triggerConfetti();

        alert(`✅ Ação registrada com sucesso para a ${team.name}!\n\nCódigo: ${newSub.code}\nPontuação Provisória: +${newSub.calculatedPoints} pontos.`);
        
        onSuccess();
        onClose();
      } catch (err) {
        alert(`Erro ao enviar ação: ${err.message}`);
        submitBtn.innerText = 'ENVIAR COMPROVAÇÃO';
        submitBtn.disabled = false;
      }
    });

    // Dynamic points live update
    const updateLivePoints = () => {
      if (!selectedMission) return;
      const quantity = parseInt(document.getElementById('action-quantity').value) || 1;
      const pts = window.appStore.calculatePoints(selectedMission.category, quantity, teamMembers.length, team.id);
      document.getElementById('live-points-display').innerHTML = `${pts} <span class="text-sm font-normal text-slate-400">pts</span>`;
    };

    document.getElementById('action-quantity').addEventListener('input', updateLivePoints);
    updateLivePoints();
    renderFilesPreview();
  };

  window.selectMissionCard = (missionId) => {
    let found = weeklyMissions.find(m => m.id === missionId);
    if (!found) {
      found = blitzMissions.find(m => m.id === missionId);
    }
    if (found) {
      selectedMission = found;
      renderModalContent();
    }
  };

  window.closeActionModal = () => {
    onClose();
  };

  renderModalContent();
}
