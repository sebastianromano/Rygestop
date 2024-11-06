// Create and insert the admin panel styles
const style = document.createElement('style');
style.textContent = `
    #admin-trigger {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0.2;
        transition: opacity 0.3s;
        padding: 0.5rem;
        font-size: 1.2rem;
    }
    #admin-trigger:hover {
        opacity: 1;
    }
    #admin-panel {
        position: fixed;
        top: 3rem;
        right: 1rem;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 0.5rem;
        display: none;
        z-index: 9999;
        min-width: 200px;
    }
    .admin-btn {
        display: block;
        width: 100%;
        padding: 0.5rem 1rem;
        margin: 0.25rem 0;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        border-radius: 4px;
    }
    .admin-btn:hover {
        background: #f0f0f0;
    }
    #admin-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
    }
    .modal-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        max-width: 400px;
        width: 90%;
    }
    .modal-buttons {
        margin-top: 1rem;
        text-align: right;
    }
    .modal-btn {
        padding: 0.5rem 1rem;
        margin-left: 0.5rem;
        border-radius: 4px;
        cursor: pointer;
    }
    .modal-btn.confirm {
        background: #2563eb;
        color: white;
        border: none;
    }
    .modal-btn.cancel {
        background: #e5e7eb;
        border: none;
    }
`;
document.head.appendChild(style);

// Create and insert the admin panel HTML
const adminHtml = `
    <button id="admin-trigger">👤</button>
    <div id="admin-panel"></div>
    <div id="admin-modal">
        <div class="modal-content">
            <h3 id="modal-title"></h3>
            <p id="modal-message"></p>
            <div class="modal-buttons">
                <button class="modal-btn cancel" onclick="closeModal()">Cancel</button>
                <button class="modal-btn confirm" id="modal-confirm">Continue</button>
            </div>
        </div>
    </div>
`;

// Create a container for the admin panel
const adminContainer = document.createElement('div');
adminContainer.innerHTML = adminHtml;
document.body.appendChild(adminContainer);

// Initialize admin panel functionality
function initAdminPanel() {
    const adminTrigger = document.getElementById('admin-trigger');
    const adminPanel = document.getElementById('admin-panel');
    const modal = document.getElementById('admin-modal');

    // Time simulation functions
    function simulateFutureDate() {
        const currentOffset = parseInt(localStorage.getItem('timeOffset') || '0');
        const oneDayMs = 24 * 60 * 60 * 1000;
        const newOffset = currentOffset + oneDayMs;
        localStorage.setItem('timeOffset', newOffset.toString());
        window.location.reload();
    }

    function simulatePastDate() {
        const currentOffset = parseInt(localStorage.getItem('timeOffset') || '0');
        const oneDayMs = 24 * 60 * 60 * 1000;
        const newOffset = currentOffset - oneDayMs;
        localStorage.setItem('timeOffset', newOffset.toString());
        window.location.reload();
    }

    function resetDateSimulation() {
        localStorage.removeItem('timeOffset');
        window.location.reload();
    }

    function clearStorage() {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach(cookie => {
            document.cookie = cookie
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
        window.location.reload();
    }

    function toggleDebugMode() {
        const current = localStorage.getItem('debugMode') === 'true';
        localStorage.setItem('debugMode', (!current).toString());
        window.location.reload();
    }

    // Admin actions configuration
    const adminActions = [
        {
            label: '⏰ Future Date (+1 day)',
            action: () => showConfirm('Simulate Future Date', 'Move time forward by 1 day?', simulateFutureDate)
        },
        {
            label: '📅 Past Date (-1 day)',
            action: () => showConfirm('Simulate Past Date', 'Move time backward by 1 day?', simulatePastDate)
        },
        {
            label: '🔄 Reset Date',
            action: () => showConfirm('Reset Date', 'Reset to current time?', resetDateSimulation)
        },
        {
            label: '🗑️ Clear Storage',
            action: () => showConfirm('Clear Storage', 'Clear all stored data?', clearStorage)
        },
        {
            label: '📊 View Storage',
            action: () => console.log('LocalStorage:', { ...localStorage })
        },
        {
            label: '🐛 Toggle Debug',
            action: toggleDebugMode
        }
    ];

    // Create admin panel buttons
    adminActions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'admin-btn';
        button.textContent = action.label;
        button.onclick = action.action;
        adminPanel.appendChild(button);
    });

    // Toggle admin panel
    adminTrigger.onclick = () => {
        adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
    };

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (!adminPanel.contains(e.target) && e.target !== adminTrigger) {
            adminPanel.style.display = 'none';
        }
    });

    // Modal functionality
    window.closeModal = function () {
        modal.style.display = 'none';
    }

    function showConfirm(title, message, action) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        document.getElementById('modal-confirm').onclick = () => {
            action();
            closeModal();
        };
        modal.style.display = 'block';
    }
}

// Handle time offset (if set)
const timeOffset = localStorage.getItem('timeOffset');
if (timeOffset) {
    const RealDate = Date;
    const offset = parseInt(timeOffset);

    Date = class extends RealDate {
        constructor(...args) {
            if (args.length === 0) {
                super();
                this.setTime(this.getTime() + offset);
                return this;
            }
            return new RealDate(...args);
        }

        static now() {
            return new RealDate().getTime() + offset;
        }
    }

    // Override other Date static methods to respect the offset
    Date.parse = function (dateString) {
        return RealDate.parse(dateString);
    }

    Date.UTC = function (...args) {
        return RealDate.UTC(...args);
    }
}

// Initialize when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPanel);
} else {
    initAdminPanel();
}
