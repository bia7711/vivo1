// Gerenciador de Tema Global - ReUse Jovem

class ThemeManager {
    constructor() {
        this.themeToggle = null;
        this.init();
    }

    init() {
        this.loadThemePreference();
        this.setupThemeToggle();
        this.applyThemeToBody();
    }

    // Carrega a preferência de tema do localStorage
    loadThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Define o tema padrão como dark, mas respeita a preferência salva
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
            // Se não houver preferência salva, usa dark mode por padrão
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }

    // Configura o toggle do tema
    setupThemeToggle() {
        this.themeToggle = document.getElementById('themeToggle');
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
            this.updateToggleState();
        }

        // Também adiciona evento para elementos com classe theme-toggle
        document.querySelectorAll('.theme-toggle').forEach(toggle => {
            if (toggle !== this.themeToggle) {
                toggle.addEventListener('click', () => this.toggleTheme());
            }
        });
    }

    // Alterna entre dark e light mode
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.updateToggleState();
        this.dispatchThemeChangeEvent(newTheme);
    }

    // Atualiza o estado visual do toggle
    updateToggleState() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (this.themeToggle) {
            this.themeToggle.setAttribute('aria-label', 
                currentTheme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro');
            
            // Atualiza ícones se necessário (para toggles que não usam CSS pseudo-elements)
            const icons = this.themeToggle.querySelectorAll('i');
            icons.forEach(icon => {
                if (currentTheme === 'dark') {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                } else {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            });
        }
    }

    // Aplica o tema ao body para compatibilidade com código existente
    applyThemeToBody() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // Dispara evento personalizado para outros scripts saberem que o tema mudou
    dispatchThemeChangeEvent(theme) {
        const event = new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        });
        document.dispatchEvent(event);
    }

    // Retorna o tema atual
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme');
    }

    // Define um tema específico
    setTheme(theme) {
        if (['dark', 'light'].includes(theme)) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            this.updateToggleState();
            this.applyThemeToBody();
            this.dispatchThemeChangeEvent(theme);
        }
    }
}

// Inicializa o gerenciador de tema quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
