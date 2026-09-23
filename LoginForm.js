// ====================================================================
// CARPEDESAFIO — LOGIN COMPONENT (OFFICIAL CARPEDIEM HOMES IDENTITY)
// ====================================================================

function renderLoginForm(containerId, onLoginSuccess) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="min-h-screen flex items-center justify-center p-4 bg-[#0C1838] relative overflow-hidden">
      <!-- Subtle Background Pattern -->
      <div class="absolute inset-0 bg-[radial-gradient(#EA580C_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>

      <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl relative z-10 border border-slate-200">
        
        <!-- Official Logo Header -->
        <div class="text-center mb-8 flex flex-col items-center">
          <img 
            src="assets/logo-carpediem.png" 
            alt="Carpediem Homes Logo" 
            class="h-16 object-contain mb-4"
            onerror="this.style.display='none'; document.getElementById('fallback-logo-text').classList.remove('hidden')"
          />
          <div id="fallback-logo-text" class="hidden text-2xl font-black text-[#0C1838] font-heading tracking-tight mb-2">
            carpediem <span class="text-xs font-normal text-slate-500 block tracking-widest uppercase">H O M E S</span>
          </div>

          <div class="inline-block px-3 py-1 bg-orange-50 border border-orange-200 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider mt-1">
            CarpeDesafio — Prêmio Reclame AQUI
          </div>
          <p class="text-slate-500 text-xs mt-2">
            Plataforma Interna de Mobilização e Registro de Ações
          </p>
        </div>

        <!-- Login Form -->
        <form id="login-form" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              E-mail Corporativo
            </label>
            <input 
              type="email" 
              id="login-email" 
              required
              placeholder="seu.email@carpediemhomes.com.br"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Senha de Acesso
            </label>
            <input 
              type="password" 
              id="login-password" 
              required
              placeholder="••••••••"
              value="123456"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition"
            />
          </div>

          <div id="login-error" class="hidden bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg p-3 text-center font-medium">
          </div>

          <button 
            type="submit"
            class="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition transform hover:-translate-y-0.5 cursor-pointer text-sm tracking-wide"
          >
            Entrar no CarpeDesafio
          </button>
        </form>

        <!-- Quick Demo Accounts -->
        <div class="mt-8 pt-6 border-t border-slate-200">
          <p class="text-[11px] text-center font-bold uppercase tracking-wider text-slate-500 mb-3">
            Acesso Rápido para Demonstração:
          </p>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button 
              type="button" 
              onclick="handleDemoLogin('admin@carpediemhomes.com.br')"
              class="bg-slate-100 hover:bg-slate-200 text-[#0C1838] font-bold py-2.5 px-3 rounded-lg border border-slate-300 transition text-left cursor-pointer truncate"
            >
              Administrador DGG
            </button>

            <button 
              type="button" 
              onclick="handleDemoLogin('lider.solar@carpediemhomes.com.br')"
              class="bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold py-2.5 px-3 rounded-lg border border-orange-200 transition text-left cursor-pointer truncate"
            >
              Líder — Equipe Solar
            </button>

            <button 
              type="button" 
              onclick="handleDemoLogin('lider.mare@carpediemhomes.com.br')"
              class="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 px-3 rounded-lg border border-blue-200 transition text-left cursor-pointer truncate"
            >
              Líder — Equipe Maré
            </button>

            <button 
              type="button" 
              onclick="handleDemoLogin('lider.horizonte@carpediemhomes.com.br')"
              class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2.5 px-3 rounded-lg border border-emerald-200 transition text-left cursor-pointer truncate"
            >
              Líder — Equipe Horizonte
            </button>
          </div>
        </div>

        <div class="mt-6 text-center text-[10px] text-slate-400">
          Acesso restrito exclusivamente a Líderes de Equipes e Gestores DGG.
        </div>
      </div>
    </div>
  `;

  // Attach submit handler
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const errorDiv = document.getElementById('login-error');

    const user = window.appStore.login(email);
    if (user) {
      onLoginSuccess(user);
    } else {
      errorDiv.classList.remove('hidden');
      errorDiv.innerText = 'Usuário não encontrado. Selecione uma conta de demonstração abaixo.';
    }
  });

  window.handleDemoLogin = (email) => {
    const user = window.appStore.login(email);
    if (user) {
      onLoginSuccess(user);
    }
  };
}
