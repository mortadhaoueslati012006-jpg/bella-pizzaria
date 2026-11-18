// Système de notifications Toast (remplace alert())

function showToast(message, type = 'success', title = '') {
    // Créer le conteneur s'il n'existe pas
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Définir les icônes et titres par défaut
    const config = {
        success: { icon: '✅', defaultTitle: 'Succès' },
        error: { icon: '❌', defaultTitle: 'Erreur' },
        info: { icon: 'ℹ️', defaultTitle: 'Information' },
        warning: { icon: '⚠️', defaultTitle: 'Attention' }
    };

    const { icon, defaultTitle } = config[type] || config.info;
    const finalTitle = title || defaultTitle;

    // Créer le toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${finalTitle}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">×</button>
    `;

    container.appendChild(toast);

    // Auto-fermeture après 4 secondes
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, 4000);
}

function closeToast(button) {
    const toast = button.closest ? button.closest('.toast') : button.parentElement;
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
            
            // Supprimer le conteneur s'il est vide
            const container = document.getElementById('toast-container');
            if (container && container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }
}

// Fonction de confirmation personnalisée
function showConfirm(message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
        <div class="confirm-dialog">
            <div class="confirm-icon">❓</div>
            <div class="confirm-message">${message}</div>
            <div class="confirm-buttons">
                <button class="btn-confirm-yes">Oui</button>
                <button class="btn-confirm-no">Non</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.querySelector('.btn-confirm-yes').onclick = () => {
        overlay.remove();
        if (onConfirm) onConfirm();
    };
    
    overlay.querySelector('.btn-confirm-no').onclick = () => {
        overlay.remove();
        if (onCancel) onCancel();
    };
    
    // Fermer en cliquant à l'extérieur
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onCancel) onCancel();
        }
    };
}

// Styles pour les toasts et confirmations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
.toast-container {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    background: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    min-width: 320px;
    max-width: 400px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideIn 0.3s ease-out;
    border-left: 4px solid #4CAF50;
}

.toast.success { border-left-color: #4CAF50; }
.toast.error { border-left-color: #F44336; }
.toast.info { border-left-color: #2196F3; }
.toast.warning { border-left-color: #FF9800; }

.toast-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.toast-content {
    flex: 1;
}

.toast-title {
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 15px;
    color: #333;
}

.toast-message {
    font-size: 14px;
    color: #666;
}

.toast-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #999;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
}

.toast-close:hover {
    background: #f0f0f0;
    color: #333;
}

@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.toast.hiding {
    animation: slideOut 0.3s ease-out forwards;
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(400px);
        opacity: 0;
    }
}

.confirm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease-out;
}

.confirm-dialog {
    background: white;
    padding: 30px;
    border-radius: 15px;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    animation: scaleIn 0.3s ease-out;
}

.confirm-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.confirm-message {
    font-size: 18px;
    color: #333;
    margin-bottom: 25px;
    line-height: 1.5;
}

.confirm-buttons {
    display: flex;
    gap: 15px;
}

.btn-confirm-yes,
.btn-confirm-no {
    flex: 1;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-confirm-yes {
    background: #4CAF50;
    color: white;
}

.btn-confirm-yes:hover {
    background: #45a049;
    transform: translateY(-2px);
}

.btn-confirm-no {
    background: #E0E0E0;
    color: #333;
}

.btn-confirm-no:hover {
    background: #BDBDBD;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes scaleIn {
    from {
        transform: scale(0.9);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .toast-container {
        right: 10px;
        left: 10px;
        top: 70px;
    }
    
    .toast {
        min-width: auto;
        width: 100%;
    }
    
    .confirm-dialog {
        margin: 0 20px;
    }
}
`;

document.head.appendChild(toastStyles);