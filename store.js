// ====================================================================
// CARPEDESAFIO — RECTIVE STORE & PERSISTENCE ENGINE
// Supports auto-scoring rules, hash verification, audit logs, week closure
// ====================================================================

const STORAGE_KEY = 'carpedesafio_app_state_v1';

// Initial Seed Data
const defaultSeedData = {
  currentUser: null, // set on login
  
  users: [
    {
      id: 'usr-admin',
      email: 'admin@carpediemhomes.com.br',
      name: 'DGG Admin (Equipe DGG)',
      role: 'ADMIN',
      teamId: null
    },
    {
      id: 'usr-lider-solar',
      email: 'lider.solar@carpediemhomes.com.br',
      name: 'Carlos Silva',
      role: 'LEADER',
      teamId: 'team-solar'
    },
    {
      id: 'usr-lider-mare',
      email: 'lider.mare@carpediemhomes.com.br',
      name: 'Fernanda Costa',
      role: 'LEADER',
      teamId: 'team-mare'
    },
    {
      id: 'usr-lider-horizonte',
      email: 'lider.horizonte@carpediemhomes.com.br',
      name: 'Lucas Andrade',
      role: 'LEADER',
      teamId: 'team-horizonte'
    }
  ],

  teams: [
    {
      id: 'team-solar',
      name: 'Equipe 01 — Solar',
      color: '#F59E0B',
      leaderId: 'usr-lider-solar',
      weeklyGoalMultiplier: 3
    },
    {
      id: 'team-mare',
      name: 'Equipe 02 — Maré',
      color: '#3B82F6',
      leaderId: 'usr-lider-mare',
      weeklyGoalMultiplier: 3
    },
    {
      id: 'team-horizonte',
      name: 'Equipe 03 — Horizonte',
      color: '#10B981',
      leaderId: 'usr-lider-horizonte',
      weeklyGoalMultiplier: 3
    }
  ],

  teamMembers: [
    // Solar (15 members)
    { id: 'mb-s1', teamId: 'team-solar', name: 'Ana Clara Santos', role: 'Consultor' },
    { id: 'mb-s2', teamId: 'team-solar', name: 'Bruno Ramos', role: 'Atendimento' },
    { id: 'mb-s3', teamId: 'team-solar', name: 'Camila Torres', role: 'Operações' },
    { id: 'mb-s4', teamId: 'team-solar', name: 'Diego Lima', role: 'Consultor' },
    { id: 'mb-s5', teamId: 'team-solar', name: 'Eduardo Melo', role: 'Suporte' },
    { id: 'mb-s6', teamId: 'team-solar', name: 'Fabiana Reis', role: 'Consultor' },
    { id: 'mb-s7', teamId: 'team-solar', name: 'Gabriel Pires', role: 'Atendimento' },
    { id: 'mb-s8', teamId: 'team-solar', name: 'Helena Rocha', role: 'Consultor' },
    { id: 'mb-s9', teamId: 'team-solar', name: 'Igor Fonseca', role: 'Operações' },
    { id: 'mb-s10', teamId: 'team-solar', name: 'Juliana Neves', role: 'Consultor' },
    { id: 'mb-s11', teamId: 'team-solar', name: 'Lucas Mendes', role: 'Suporte' },
    { id: 'mb-s12', teamId: 'team-solar', name: 'Mariana Duarte', role: 'Consultor' },
    { id: 'mb-s13', teamId: 'team-solar', name: 'Nicolas Aguiar', role: 'Atendimento' },
    { id: 'mb-s14', teamId: 'team-solar', name: 'Patricia Alencar', role: 'Consultor' },
    { id: 'mb-s15', teamId: 'team-solar', name: 'Renato Farias', role: 'Operações' },

    // Maré (12 members)
    { id: 'mb-m1', teamId: 'team-mare', name: 'Beatriz Galvão', role: 'Consultor' },
    { id: 'mb-m2', teamId: 'team-mare', name: 'Caio Junqueira', role: 'Atendimento' },
    { id: 'mb-m3', teamId: 'team-mare', name: 'Daniela Meireles', role: 'Operações' },
    { id: 'mb-m4', teamId: 'team-mare', name: 'Felipe Antunes', role: 'Consultor' },
    { id: 'mb-m5', teamId: 'team-mare', name: 'Gisele Xavier', role: 'Suporte' },
    { id: 'mb-m6', teamId: 'team-mare', name: 'Henrique Prado', role: 'Consultor' },
    { id: 'mb-m7', teamId: 'team-mare', name: 'Isabela Vieira', role: 'Atendimento' },
    { id: 'mb-m8', teamId: 'team-mare', name: 'João Pedro', role: 'Consultor' },
    { id: 'mb-m9', teamId: 'team-mare', name: 'Karina Siqueira', role: 'Operações' },
    { id: 'mb-m10', teamId: 'team-mare', name: 'Leonardo Bessa', role: 'Consultor' },
    { id: 'mb-m11', teamId: 'team-mare', name: 'Manuela Nogueira', role: 'Suporte' },
    { id: 'mb-m12', teamId: 'team-mare', name: 'Otavio Paiva', role: 'Consultor' },

    // Horizonte (14 members)
    { id: 'mb-h1', teamId: 'team-horizonte', name: 'Alice Vasconcelos', role: 'Consultor' },
    { id: 'mb-h2', teamId: 'team-horizonte', name: 'Bernardo Castilho', role: 'Atendimento' },
    { id: 'mb-h3', teamId: 'team-horizonte', name: 'Carolina Peixoto', role: 'Operações' },
    { id: 'mb-h4', teamId: 'team-horizonte', name: 'David Silveira', role: 'Consultor' },
    { id: 'mb-h5', teamId: 'team-horizonte', name: 'Elisa Botelho', role: 'Suporte' },
    { id: 'mb-h6', teamId: 'team-horizonte', name: 'Fernando Sampaio', role: 'Consultor' },
    { id: 'mb-h7', teamId: 'team-horizonte', name: 'Giovanna Maia', role: 'Atendimento' },
    { id: 'mb-h8', teamId: 'team-horizonte', name: 'Heitor Arruda', role: 'Consultor' },
    { id: 'mb-h9', teamId: 'team-horizonte', name: 'Inês Caldeira', role: 'Operações' },
    { id: 'mb-h10', teamId: 'team-horizonte', name: 'Jorge Tavares', role: 'Consultor' },
    { id: 'mb-h11', teamId: 'team-horizonte', name: 'Leticia Macedo', role: 'Suporte' },
    { id: 'mb-h12', teamId: 'team-horizonte', name: 'Marcelo Queiroz', role: 'Consultor' },
    { id: 'mb-h13', teamId: 'team-horizonte', name: 'Nathalia Franco', role: 'Atendimento' },
    { id: 'mb-h14', teamId: 'team-horizonte', name: 'Orlando Drummond', role: 'Consultor' }
  ],

  weeks: [
    {
      id: 'wk-1',
      number: 1,
      title: 'Semana 1 — Arrancada Inicial',
      startDate: '2026-09-08',
      endDate: '2026-09-14',
      status: 'CLOSED',
      closedAt: '2026-09-15T00:00:00Z',
      closedBy: 'usr-admin'
    },
    {
      id: 'wk-2',
      number: 2,
      title: 'Semana 2 — Mobilização Reclame AQUI',
      startDate: '2026-09-15',
      endDate: '2026-09-22',
      status: 'OPEN',
      closedAt: null,
      closedBy: null
    },
    {
      id: 'wk-3',
      number: 3,
      title: 'Semana 3 — Reta Final do Prêmio',
      startDate: '2026-09-23',
      endDate: '2026-09-29',
      status: 'OPEN',
      closedAt: null,
      closedBy: null
    }
  ],

  missions: [
    {
      id: 'ms-blitz-1',
      title: '⚡ Card Oficial Reclame AQUI no Instagram',
      description: 'Publique o card oficial da campanha de votação Reclame AQUI no seu perfil do Instagram ou feed.',
      category: 'Missão-relâmpago',
      points: 15,
      isBlitz: true,
      startDate: '2026-09-20T08:00:00',
      endDate: '2026-09-24T23:59:00',
      maxSubmissions: 1,
      requiresApproval: true,
      status: 'OPEN'
    },
    {
      id: 'ms-carpeclub-1',
      title: '🎯 Desafio CarpeClub 100% Engajado',
      description: 'Engaje todos os integrantes da sua equipe no portal CarpeClub durante a semana.',
      category: 'CarpeClub',
      points: 5, // per member + bonus
      isBlitz: false,
      startDate: '2026-09-15T00:00:00',
      endDate: '2026-09-22T23:59:00',
      maxSubmissions: null,
      requiresApproval: true,
      status: 'OPEN'
    },
    {
      id: 'ms-whatsapp-1',
      title: '💬 Divulgação em Grupos VIP WhatsApp',
      description: 'Compartilhe o banner da votação em grupos com clientes e parceiros autorizados.',
      category: 'WhatsApp / Grupos',
      points: 5,
      isBlitz: false,
      startDate: '2026-09-15T00:00:00',
      endDate: '2026-09-22T23:59:00',
      maxSubmissions: null,
      requiresApproval: false,
      status: 'OPEN'
    },
    {
      id: 'ms-blitz-2',
      title: '⚡ Vídeo Depoimento Presencial',
      description: 'Grave um vídeo curto com um hospede/cliente incentivando o voto no Prêmio Reclame AQUI.',
      category: 'Missão-relâmpago',
      points: 30,
      isBlitz: true,
      startDate: '2026-09-21T00:00:00',
      endDate: '2026-09-23T18:00:00',
      maxSubmissions: 2,
      requiresApproval: true,
      status: 'ENDING_SOON'
    }
  ],

  missionRules: [
    {
      category: 'CarpeClub',
      pointsPerUnit: 5,
      bonus100PercentParticipation: 30,
      bonusGoalMet: 50,
      requiresEvidenceAbovePoints: 20,
      requiresAdminApprovalAbovePoints: 50
    },
    {
      category: 'WhatsApp / Grupos',
      pointsPerUnit: 5,
      tierConfig: [
        { minQuantity: 5, bonusPoints: 15 },
        { minQuantity: 10, bonusPoints: 30 }
      ],
      bonusGoalMet: 50,
      requiresEvidenceAbovePoints: 20,
      requiresAdminApprovalAbovePoints: 50
    },
    {
      category: 'Instagram',
      pointsPerUnit: 10,
      bonusGoalMet: 30,
      requiresEvidenceAbovePoints: 20,
      requiresAdminApprovalAbovePoints: 50
    },
    {
      category: 'LinkedIn',
      pointsPerUnit: 10,
      bonusGoalMet: 30,
      requiresEvidenceAbovePoints: 20,
      requiresAdminApprovalAbovePoints: 50
    },
    {
      category: 'Status WhatsApp',
      pointsPerUnit: 5,
      requiresEvidenceAbovePoints: 20,
      requiresAdminApprovalAbovePoints: 50
    },
    {
      category: 'Ação presencial',
      pointsPerUnit: 20,
      requiresEvidenceAbovePoints: 20,
      requiresAdminApprovalAbovePoints: 50
    },
    {
      category: 'Missão-relâmpago',
      pointsPerUnit: 15,
      requiresEvidenceAbovePoints: 20,
      requiresAdminApprovalAbovePoints: 50
    },
    {
      category: 'Outra ação autorizada',
      pointsPerUnit: 5,
      requiresEvidenceAbovePoints: 20,
      requiresAdminApprovalAbovePoints: 50
    }
  ],

  submissions: [
    {
      id: 'sub-101',
      code: 'CP-2026-0922-00101',
      teamId: 'team-solar',
      leaderId: 'usr-lider-solar',
      weekId: 'wk-2',
      missionId: 'ms-carpeclub-1',
      category: 'CarpeClub',
      actionDate: '2026-09-20',
      quantity: 15,
      participantIds: ['mb-s1', 'mb-s2', 'mb-s3', 'mb-s4', 'mb-s5', 'mb-s6', 'mb-s7', 'mb-s8', 'mb-s9', 'mb-s10', 'mb-s11', 'mb-s12', 'mb-s13', 'mb-s14', 'mb-s15'],
      description: '100% da Equipe Solar registrou acesso e votação no portal CarpeClub.',
      calculatedPoints: 105, // (15 * 5) + 30 bônus
      officialPoints: 105,
      status: 'APPROVED',
      isPossibleDuplicate: false,
      evidenceFiles: [
        {
          id: 'ev-1',
          fileName: 'comprovante_carpeclub_solar.png',
          fileSize: 458200,
          fileType: 'image/png',
          fileUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
          fileHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        }
      ],
      reviewedAt: '2026-09-21T10:15:00Z',
      reviewedBy: 'usr-admin',
      rejectionReason: null,
      createdAt: '2026-09-20T14:30:00Z'
    },
    {
      id: 'sub-102',
      code: 'CP-2026-0922-00102',
      teamId: 'team-mare',
      leaderId: 'usr-lider-mare',
      weekId: 'wk-2',
      missionId: 'ms-whatsapp-1',
      category: 'WhatsApp / Grupos',
      actionDate: '2026-09-21',
      quantity: 7,
      participantIds: ['mb-m1', 'mb-m2', 'mb-m3', 'mb-m4', 'mb-m5'],
      description: 'Divulgação do link de votação em 7 grupos de proprietários e parceiros.',
      calculatedPoints: 50, // (7 * 5) + 15 bônus de 5 grupos
      officialPoints: 0,
      status: 'PENDING',
      isPossibleDuplicate: false,
      evidenceFiles: [
        {
          id: 'ev-2',
          fileName: 'prints_grupos_whatsapp.pdf',
          fileSize: 1240000,
          fileType: 'application/pdf',
          fileUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
          fileHash: 'sha256-9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
        }
      ],
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
      createdAt: '2026-09-21T16:00:00Z'
    },
    {
      id: 'sub-103',
      code: 'CP-2026-0922-00103',
      teamId: 'team-horizonte',
      leaderId: 'usr-lider-horizonte',
      weekId: 'wk-2',
      missionId: 'ms-blitz-1',
      category: 'Missão-relâmpago',
      actionDate: '2026-09-22',
      quantity: 3,
      participantIds: ['mb-h1', 'mb-h2', 'mb-h3'],
      description: 'Posts nos stories do Instagram com link direto.',
      calculatedPoints: 45,
      officialPoints: 0,
      status: 'REJECTED',
      isPossibleDuplicate: false,
      evidenceFiles: [
        {
          id: 'ev-3',
          fileName: 'story_print_recorte.jpg',
          fileSize: 320000,
          fileType: 'image/jpeg',
          fileUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=800&q=80',
          fileHash: 'sha256-d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592'
        }
      ],
      reviewedAt: '2026-09-22T09:00:00Z',
      reviewedBy: 'usr-admin',
      rejectionReason: 'O print anexado não exibe o horário ou o nome do perfil de forma visível para comprovação válida.',
      createdAt: '2026-09-22T08:15:00Z'
    },
    {
      id: 'sub-104',
      code: 'CP-2026-0922-00104',
      teamId: 'team-solar',
      leaderId: 'usr-lider-solar',
      weekId: 'wk-2',
      missionId: null,
      category: 'Instagram',
      actionDate: '2026-09-22',
      quantity: 5,
      participantIds: ['mb-s1', 'mb-s2'],
      description: 'Ação presencial e postagem duplicada para validação.',
      calculatedPoints: 50,
      officialPoints: 0,
      status: 'PENDING',
      isPossibleDuplicate: true,
      duplicateReason: '⚠️ POSSÍVEL DUPLICIDADE: O arquivo comprovante_carpeclub_solar.png possui o mesmo hash SHA-256 da submissão CP-2026-0922-00101.',
      evidenceFiles: [
        {
          id: 'ev-4',
          fileName: 'comprovante_carpeclub_solar.png',
          fileSize: 458200,
          fileType: 'image/png',
          fileUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
          fileHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' // Same hash!
        }
      ],
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
      createdAt: '2026-09-22T11:45:00Z'
    }
  ],

  weeklyScoresHistory: [
    {
      weekId: 'wk-1',
      teamId: 'team-solar',
      officialPoints: 850,
      provisionalPoints: 850,
      bonusPoints: 80,
      participationPercentage: 93.3,
      rankPosition: 1,
      isFrozen: true
    },
    {
      weekId: 'wk-1',
      teamId: 'team-mare',
      officialPoints: 720,
      provisionalPoints: 720,
      bonusPoints: 50,
      participationPercentage: 83.3,
      rankPosition: 2,
      isFrozen: true
    },
    {
      weekId: 'wk-1',
      teamId: 'team-horizonte',
      officialPoints: 690,
      provisionalPoints: 690,
      bonusPoints: 30,
      participationPercentage: 78.5,
      rankPosition: 3,
      isFrozen: true
    }
  ],

  auditLogs: [
    {
      id: 'log-1',
      userName: 'DGG Admin',
      action: 'APPROVE_SUBMISSION',
      targetType: 'SUBMISSION',
      targetId: 'sub-101',
      details: 'Ação CP-2026-0922-00101 da Equipe 01 — Solar aprovada (+105 pontos oficiais).',
      justification: null,
      timestamp: '2026-09-21T10:15:00Z'
    },
    {
      id: 'log-2',
      userName: 'DGG Admin',
      action: 'REJECT_SUBMISSION',
      targetType: 'SUBMISSION',
      targetId: 'sub-103',
      details: 'Submissão CP-2026-0922-00103 reprovada.',
      justification: 'Print ilegível sem identificação do perfil.',
      timestamp: '2026-09-22T09:00:00Z'
    },
    {
      id: 'log-3',
      userName: 'DGG Admin',
      action: 'WEEK_CLOSE',
      targetType: 'WEEK',
      targetId: 'wk-1',
      details: 'Semana 1 encerrada e pontuações congeladas com sucesso.',
      justification: null,
      timestamp: '2026-09-15T00:00:00Z'
    }
  ]
};

// Store Engine Class
class StoreEngine {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read from LocalStorage:', e);
    }
    return JSON.parse(JSON.stringify(defaultSeedData));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Could not save to LocalStorage:', e);
    }
    this.notify();
  }

  resetToSeed() {
    this.state = JSON.parse(JSON.stringify(defaultSeedData));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l(this.state));
  }

  // Auth methods
  login(email) {
    const user = this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.state.currentUser = user;
      this.saveState();
      return user;
    }
    return null;
  }

  logout() {
    this.state.currentUser = null;
    this.saveState();
  }

  // Scoring Rule calculation
  calculatePoints(category, quantity, numSelectedMembers, teamId) {
    const team = this.state.teams.find(t => t.id === teamId);
    const totalMembersInTeam = this.state.teamMembers.filter(m => m.teamId === teamId && m.active).length || 1;
    const rule = this.state.missionRules.find(r => r.category === category) || { pointsPerUnit: 5 };

    const selectedCount = (numSelectedMembers !== undefined && numSelectedMembers !== null && numSelectedMembers > 0) 
      ? numSelectedMembers 
      : totalMembersInTeam;

    let base = rule.pointsPerUnit * quantity;
    let bonus = 0;

    // 100% participation bonus
    if (selectedCount >= totalMembersInTeam && rule.bonus100PercentParticipation) {
      bonus += rule.bonus100PercentParticipation;
    }

    // Tier bonuses (e.g. WhatsApp volume tiers)
    if (rule.tierConfig && Array.isArray(rule.tierConfig)) {
      let highestTierBonus = 0;
      rule.tierConfig.forEach(tier => {
        if (quantity >= tier.minQuantity) {
          highestTierBonus = Math.max(highestTierBonus, tier.bonusPoints);
        }
      });
      bonus += highestTierBonus;
    }

    return base + bonus;
  }

  // Duplicate Check Engine
  async checkDuplicateEvidence(fileHashes, participantIds, actionDate) {
    let duplicateAlert = null;
    
    // Check hash duplication
    for (const hash of fileHashes) {
      for (const sub of this.state.submissions) {
        if (sub.evidenceFiles && sub.evidenceFiles.some(f => f.fileHash === hash)) {
          duplicateAlert = `⚠️ POSSÍVEL DUPLICIDADE: Um dos arquivos anexados possui o mesmo hash SHA-256 de uma comprovação já enviada anteriormente (Submissão ${sub.code}).`;
          break;
        }
      }
      if (duplicateAlert) break;
    }

    // Check same participants registered twice on same date/category
    if (!duplicateAlert && participantIds && participantIds.length > 0) {
      for (const sub of this.state.submissions) {
        if (sub.actionDate === actionDate && sub.status !== 'REJECTED' && sub.status !== 'CANCELLED') {
          const overlap = sub.participantIds.filter(pid => participantIds.includes(pid));
          if (overlap.length > 0 && overlap.length === participantIds.length) {
            duplicateAlert = `⚠️ POSSÍVEL DUPLICIDADE: A equipe já possui um registro de ação nesta mesma data (${sub.code}).`;
            break;
          }
        }
      }
    }

    return duplicateAlert;
  }

  // Action Submission
  async submitAction(payload) {
    const leader = this.state.currentUser;
    if (!leader || leader.role !== 'LEADER') {
      throw new Error('Somente líderes podem registrar ações.');
    }

    // Current week check
    const currentWeek = this.state.weeks.find(w => w.status === 'OPEN') || this.state.weeks[1];
    if (currentWeek.status === 'CLOSED') {
      throw new Error('Não é possível registrar ações em semanas já encerradas.');
    }

    const allTeamMemberIds = this.state.teamMembers
      .filter(m => m.teamId === leader.teamId && m.active)
      .map(m => m.id);

    const finalParticipantIds = (payload.participantIds && payload.participantIds.length > 0)
      ? payload.participantIds
      : allTeamMemberIds;

    const calculatedPoints = this.calculatePoints(
      payload.category,
      payload.quantity,
      finalParticipantIds.length,
      leader.teamId
    );

    // Code generator CP-2026-MMDD-XXXXX
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const seq = String(this.state.submissions.length + 1).padStart(5, '0');
    const code = `CP-2026-${mm}${dd}-${seq}`;

    // Anti-fraud check
    const fileHashes = payload.evidenceFiles.map(f => f.fileHash);
    const duplicateReason = await this.checkDuplicateEvidence(fileHashes, finalParticipantIds, payload.actionDate);

    const newSub = {
      id: 'sub-' + Date.now(),
      code,
      teamId: leader.teamId,
      leaderId: leader.id,
      weekId: currentWeek.id,
      missionId: payload.missionId || null,
      category: payload.category,
      actionDate: payload.actionDate,
      quantity: payload.quantity,
      participantIds: finalParticipantIds,
      description: payload.description || '',
      calculatedPoints,
      officialPoints: 0,
      status: 'PENDING',
      isPossibleDuplicate: !!duplicateReason,
      duplicateReason: duplicateReason || null,
      evidenceFiles: payload.evidenceFiles,
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
      createdAt: new Date().toISOString()
    };

    this.state.submissions.unshift(newSub);
    this.saveState();
    return newSub;
  }

  // Admin Actions
  approveSubmission(subId) {
    const admin = this.state.currentUser;
    const sub = this.state.submissions.find(s => s.id === subId);
    if (!sub) return;

    sub.status = 'APPROVED';
    sub.officialPoints = sub.calculatedPoints;
    sub.reviewedAt = new Date().toISOString();
    sub.reviewedBy = admin ? admin.id : 'usr-admin';

    this.addAuditLog({
      userName: admin ? admin.name : 'DGG Admin',
      action: 'APPROVE_SUBMISSION',
      targetType: 'SUBMISSION',
      targetId: sub.code,
      details: `Submissão ${sub.code} aprovada (+${sub.officialPoints} pontos oficiais).`
    });

    this.saveState();
  }

  rejectSubmission(subId, reason) {
    const admin = this.state.currentUser;
    const sub = this.state.submissions.find(s => s.id === subId);
    if (!sub) return;

    sub.status = 'REJECTED';
    sub.officialPoints = 0;
    sub.rejectionReason = reason;
    sub.reviewedAt = new Date().toISOString();
    sub.reviewedBy = admin ? admin.id : 'usr-admin';

    this.addAuditLog({
      userName: admin ? admin.name : 'DGG Admin',
      action: 'REJECT_SUBMISSION',
      targetType: 'SUBMISSION',
      targetId: sub.code,
      details: `Submissão ${sub.code} reprovada. Motivo: "${reason}".`,
      justification: reason
    });

    this.saveState();
  }

  overrideScore(subId, newScore, justification) {
    const admin = this.state.currentUser;
    const sub = this.state.submissions.find(s => s.id === subId);
    if (!sub) return;

    const oldScore = sub.calculatedPoints;
    sub.calculatedPoints = Number(newScore);
    if (sub.status === 'APPROVED') {
      sub.officialPoints = Number(newScore);
    }
    sub.manualOverrideJustification = justification;

    this.addAuditLog({
      userName: admin ? admin.name : 'DGG Admin',
      action: 'SCORE_OVERRIDE',
      targetType: 'SUBMISSION',
      targetId: sub.code,
      details: `Pontuação da submissão ${sub.code} alterada manualmente de ${oldScore} para ${newScore} pts.`,
      justification
    });

    this.saveState();
  }

  closeWeek(weekId) {
    const admin = this.state.currentUser;
    const week = this.state.weeks.find(w => w.id === weekId);
    if (!week) return;

    week.status = 'CLOSED';
    week.closedAt = new Date().toISOString();
    week.closedBy = admin ? admin.id : 'usr-admin';

    // Freeze team scores for this week
    this.state.teams.forEach((team, idx) => {
      const stats = this.getTeamScoreStats(team.id, week.id);
      this.state.weeklyScoresHistory.push({
        weekId: week.id,
        teamId: team.id,
        officialPoints: stats.officialPoints,
        provisionalPoints: stats.provisionalPoints,
        bonusPoints: stats.bonusPoints,
        participationPercentage: stats.participationPercentage,
        rankPosition: idx + 1,
        isFrozen: true
      });
    });

    this.addAuditLog({
      userName: admin ? admin.name : 'DGG Admin',
      action: 'WEEK_CLOSE',
      targetType: 'WEEK',
      targetId: week.title,
      details: `${week.title} encerrada e pontuações congeladas.`
    });

    this.saveState();
  }

  reopenWeek(weekId) {
    const admin = this.state.currentUser;
    const week = this.state.weeks.find(w => w.id === weekId);
    if (!week) return;

    week.status = 'OPEN';
    week.closedAt = null;
    week.closedBy = null;

    // Unfreeze history entries
    this.state.weeklyScoresHistory = this.state.weeklyScoresHistory.filter(h => h.weekId !== weekId);

    this.addAuditLog({
      userName: admin ? admin.name : 'DGG Admin',
      action: 'WEEK_REOPEN',
      targetType: 'WEEK',
      targetId: week.title,
      details: `Reabertura excepcional da ${week.title}.`,
      justification: 'Solicitação administrativa de ajuste.'
    });

    this.saveState();
  }

  addAuditLog(log) {
    this.state.auditLogs.unshift({
      id: 'log-' + Date.now() + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
      justification: null,
      ...log
    });
  }

  // Mission Management (Admin DGG)
  addMission(missionData) {
    const admin = this.state.currentUser;
    const newMission = {
      id: 'ms-' + Date.now(),
      title: missionData.title,
      description: missionData.description || '',
      category: missionData.category || 'Missão-relâmpago',
      points: Number(missionData.points) || 10,
      isBlitz: missionData.isBlitz !== undefined ? !!missionData.isBlitz : true,
      startDate: missionData.startDate || new Date().toISOString(),
      endDate: missionData.endDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      maxSubmissions: missionData.maxSubmissions ? Number(missionData.maxSubmissions) : null,
      requiresApproval: missionData.requiresApproval !== undefined ? !!missionData.requiresApproval : true,
      status: missionData.status || 'OPEN'
    };

    this.state.missions.unshift(newMission);
    this.addAuditLog({
      userName: admin ? admin.name : 'DGG Admin',
      action: 'CREATE_MISSION',
      targetType: 'MISSION',
      targetId: newMission.title,
      details: `Nova missão "${newMission.title}" criada (+${newMission.points} pts).`
    });

    this.saveState();
    return newMission;
  }

  updateMission(missionId, missionData) {
    const admin = this.state.currentUser;
    const ms = this.state.missions.find(m => m.id === missionId);
    if (!ms) return;

    Object.assign(ms, missionData);

    this.addAuditLog({
      userName: admin ? admin.name : 'DGG Admin',
      action: 'UPDATE_MISSION',
      targetType: 'MISSION',
      targetId: ms.title,
      details: `Missão "${ms.title}" atualizada.`
    });

    this.saveState();
  }

  deleteMission(missionId) {
    const admin = this.state.currentUser;
    const ms = this.state.missions.find(m => m.id === missionId);
    if (!ms) return;

    const title = ms.title;
    this.state.missions = this.state.missions.filter(m => m.id !== missionId);

    this.addAuditLog({
      userName: admin ? admin.name : 'DGG Admin',
      action: 'DELETE_MISSION',
      targetType: 'MISSION',
      targetId: title,
      details: `Missão "${title}" removida do sistema.`
    });

    this.saveState();
  }

  // Analytics & Ranking Helpers
  getTeamScoreStats(teamId, weekIdFilter = null) {
    let teamSubmissions = this.state.submissions.filter(s => s.teamId === teamId);
    if (weekIdFilter) {
      teamSubmissions = teamSubmissions.filter(s => s.weekId === weekIdFilter);
    }

    const officialPoints = teamSubmissions
      .filter(s => s.status === 'APPROVED')
      .reduce((acc, s) => acc + (s.officialPoints || s.calculatedPoints), 0);

    const provisionalPoints = teamSubmissions
      .filter(s => s.status === 'PENDING' || s.status === 'APPROVED')
      .reduce((acc, s) => acc + s.calculatedPoints, 0);

    const pendingPoints = teamSubmissions
      .filter(s => s.status === 'PENDING')
      .reduce((acc, s) => acc + s.calculatedPoints, 0);

    // Calculate team participation percentage
    const allMembers = this.state.teamMembers.filter(m => m.teamId === teamId && m.active);
    const uniqueParticipantsInAction = new Set();
    teamSubmissions.forEach(s => {
      s.participantIds.forEach(pid => uniqueParticipantsInAction.add(pid));
    });

    const participationPercentage = allMembers.length > 0
      ? Number(((uniqueParticipantsInAction.size / allMembers.length) * 100).toFixed(1))
      : 0;

    return {
      officialPoints,
      provisionalPoints,
      pendingPoints,
      bonusPoints: Math.round(officialPoints * 0.15), // Calculated bonus component
      participationPercentage,
      totalActions: teamSubmissions.length,
      membersParticipatingCount: uniqueParticipantsInAction.size,
      totalMembersCount: allMembers.length
    };
  }

  getLeaderboard() {
    return this.state.teams.map(team => {
      const stats = this.getTeamScoreStats(team.id);
      return {
        team,
        ...stats
      };
    }).sort((a, b) => b.officialPoints - a.officialPoints || b.provisionalPoints - a.provisionalPoints);
  }
}

// Global Singleton Store Instance
window.appStore = new StoreEngine();
