export const initAdminStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        #admin-trigger {
            opacity: 0.2;
            transition: opacity 0.3s;
        }
        #admin-trigger:hover {
            opacity: 1;
        }
        #admin-panel {
            display: none;
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
    `;
    document.head.appendChild(style);

    // Add click handler to show/hide panel
    document.addEventListener('DOMContentLoaded', () => {
        const adminTrigger = document.getElementById('admin-trigger');
        const adminPanel = document.getElementById('admin-panel');

        if (adminTrigger && adminPanel) {
            adminTrigger.onclick = () => {
                adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
            };

            document.addEventListener('click', (e) => {
                if (!adminPanel.contains(e.target) && e.target !== adminTrigger) {
                    adminPanel.style.display = 'none';
                }
            });
        }
    });
};
