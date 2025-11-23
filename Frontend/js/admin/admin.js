// DOM Elements
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');

// Sidebar Toggle
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get section ID
        const sectionId = link.getAttribute('data-section');

        // Perfil deshabilitado
        if (sectionId === 'profile') {
            showNotification('El perfil del administrador está deshabilitado', 'warning');
            return;
        }
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked nav item (si existe)
        const navItem = link.closest('.nav-item');
        if (navItem) navItem.classList.add('active');
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
            
            // Update page title
            const titleMap = {
                'dashboard': 'Panel',
                'products': 'Gestión de libros',
                'settings': 'Alta de libro',
                'profile': 'Perfil del administrador'
            };
            pageTitle.textContent = titleMap[sectionId] || 'Panel';
        }
    });
});

// Set initial active state
document.querySelector('.nav-item').classList.add('active');

// Button Actions
const addButtons = document.querySelectorAll('.btn-primary');
addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.textContent.includes('Agregar') || btn.textContent.includes('Nuevo')) {
            showNotification(`${btn.textContent} presionado`, 'info');
        } else if (btn.textContent.includes('Guardar')) {
            showNotification('¡Cambios guardados correctamente!', 'success');
        } else if (btn.textContent.includes('Actualizar')) {
            showNotification('¡Perfil actualizado correctamente!', 'success');
        }
    });
});

// Action Buttons
const actionButtons = document.querySelectorAll('.btn-action');
actionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const icon = btn.querySelector('i');
        if (icon.classList.contains('bi-pencil-square')) {
            showNotification('Acción de edición ejecutada', 'info');
        } else if (icon.classList.contains('bi-trash')) {
            if (confirm('¿Seguro que deseas eliminar este elemento?')) {
                showNotification('Elemento eliminado correctamente', 'success');
                btn.closest('tr') ? btn.closest('tr').remove() : btn.closest('.product-card').remove();
            }
        } else if (icon.classList.contains('bi-eye')) {
            showNotification('Ver detalles', 'info');
        }
    });
});

// Icon Buttons (Notifications, Messages)
const iconButtons = document.querySelectorAll('.icon-btn');
iconButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const icon = btn.querySelector('i');
        if (icon.classList.contains('bi-bell')) {
            showNotification('Tienes 3 nuevas notificaciones', 'info');
        } else if (icon.classList.contains('bi-envelope')) {
            showNotification('Tienes 5 nuevos mensajes', 'info');
        }
    });
});

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length > 0) {
            console.log('Searching for:', searchTerm);
        }
    });
}

// Image preview for book form
const bookImageInput = document.getElementById('book-image');
const bookPreview = document.getElementById('book-preview');
if (bookImageInput && bookPreview) {
    bookImageInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            bookPreview.innerHTML = '<i class="bi bi-image" style="font-size:48px;color:#888;"></i>';
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            bookPreview.innerHTML = '';
            const img = document.createElement('img');
            img.src = reader.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'cover';
            bookPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${getIconForType(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function getIconForType(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-octagon',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Add notification styles dynamically
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        padding: 15px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        min-width: 300px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.3s ease;
    }

    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification-success {
        border-left: 4px solid #27ae60;
    }

    .notification-success .notification-content i {
        color: #27ae60;
    }

    .notification-error {
        border-left: 4px solid #e74c3c;
    }

    .notification-error .notification-content i {
        color: #e74c3c;
    }

    .notification-warning {
        border-left: 4px solid #f39c12;
    }

    .notification-warning .notification-content i {
        color: #f39c12;
    }

    .notification-info {
        border-left: 4px solid #667eea;
    }

    .notification-info .notification-content i {
        color: #667eea;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        color: #7f8c8d;
        cursor: pointer;
        padding: 0;
        transition: color 0.3s ease;
    }

    .notification-close:hover {
        color: #2c3e50;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(400px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @media (max-width: 480px) {
        .notification {
            min-width: auto;
            width: calc(100% - 20px);
            right: 10px;
            left: 10px;
        }
    }
`;
document.head.appendChild(style);

// Form handling
const forms = document.querySelectorAll('.settings-form, .profile-form');
forms.forEach(form => {
    const submitBtn = form.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.type !== 'checkbox' && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                showNotification('¡Cambios guardados correctamente!', 'success');
            } else {
                showNotification('Por favor completa todos los campos requeridos', 'warning');
            }
        });
    }
});

// Dropdown menu toggle
const userBtn = document.querySelector('.user-btn');
if (userBtn) {
    userBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdownMenu = userBtn.nextElementSibling;
        if (dropdownMenu) {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        }
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', () => {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        menu.style.display = 'none';
    });
});

// Logout functionality
const logoutLink = document.querySelector('a[href="#logout"]');
if (logoutLink) {
logoutLink.addEventListener('click', (e) => {
e.preventDefault();
if (confirm('¿Seguro que deseas cerrar sesión?')) {
showNotification('Cierre de sesión exitoso', 'success');
setTimeout(() => {
// En una app real, redirigiría a la página de inicio de sesión
console.log('Redirigiendo a inicio de sesión...');
}, 1500);
}
});
}

// Profile link
const profileLink = document.querySelector('a[href="#profile"]');
if (profileLink) {
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('El perfil del administrador está deshabilitado', 'warning');
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('title');
            tooltip.style.cssText = `
                position: absolute;
                background-color: #2c3e50;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                z-index: 10001;
                pointer-events: none;
            `;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            
            element.addEventListener('mouseleave', () => {
                tooltip.remove();
            });
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTooltips();
    console.log('¡Panel de administración inicializado!');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput?.focus();
    }
    
    // Escape to close dropdowns
    if (e.key === 'Escape') {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

// Responsive sidebar on mobile
function handleResponsive() {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
}

window.addEventListener('resize', handleResponsive);
handleResponsive();

// Add some demo data interactions
const tableRows = document.querySelectorAll('.table tbody tr');
tableRows.forEach(row => {
    row.addEventListener('click', () => {
        row.style.backgroundColor = 'rgba(102, 126, 234, 0.05)';
        setTimeout(() => {
            row.style.backgroundColor = '';
        }, 500);
    });
});

console.log('Script del Panel de Administración cargado');
