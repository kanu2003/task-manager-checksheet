// public/js/login_modal.js

// Using an IIFE (Immediately Invoked Function Expression) for encapsulation
(function() {
    // --- Inject CSS Styles for the Modal into the document's head ---
    function injectModalStyles() {
        const style = document.createElement('style');
        style.id = 'approval-login-modal-styles';
        if (document.getElementById(style.id)) return;

        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

            #approvalLoginModal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(6px);
                justify-content: center;
                align-items: center;
                opacity: 0;
                transition: opacity 0.4s ease;
                font-family: 'Poppins', sans-serif;
            }

            #approvalLoginModal.show {
                opacity: 1;
            }

            #approvalLoginModal > div {
                background: #ffffff;
                border: 1px solid #e0e6ed;
                border-radius: 12px;
                padding: 40px 30px;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
                width: 90%;
                max-width: 400px;
                text-align: center;
                transform: scale(0.95);
                transition: transform 0.3s ease, opacity 0.3s ease;
                color: #2c3e50;
            }

            #approvalLoginModal.show > div {
                transform: scale(1);
            }

            #approvalLoginModal h3 {
                margin-bottom: 20px;
                font-size: 1.8em;
                font-weight: 600;
                color: #003366;
            }

            #approvalLoginModal input[type="text"],
            #approvalLoginModal input[type="password"] {
                width: 100%;
                padding: 12px 14px;
                margin-bottom: 16px;
                border: 1px solid #d0d7de;
                border-radius: 8px;
                font-size: 1em;
                background: #f9fbfd;
                color: #2c3e50;
                transition: border-color 0.3s, box-shadow 0.3s;
            }

            #approvalLoginModal input:focus {
                border-color: #007bff;
                box-shadow: 0 0 6px rgba(0,123,255,0.3);
                outline: none;
                background: #ffffff;
            }

            #approvalLoginModal input::placeholder {
                color: #95a5a6;
            }

            #approvalLoginModal button {
                width: 100%;
                padding: 12px;
                font-size: 1em;
                font-weight: 600;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.2s ease;
            }

            #modalLoginButton {
                background-color: #0066cc;
                color: white;
                margin-top: 8px;
            }

            #modalLoginButton:hover {
                background-color: #0052a3;
                transform: translateY(-1px);
            }

            #modalCloseButton {
                background-color: #adb5bd;
                color: white;
                margin-top: 10px;
            }

            #modalCloseButton:hover {
                background-color: #868e96;
                transform: translateY(-1px);
            }

            #modalLoginMessage {
                margin-top: 15px;
                font-size: 0.9em;
                color: #e74c3c;
                min-height: 1em;
            }
        `;
        document.head.appendChild(style);
    }

    // --- Create and Append Modal HTML to the DOM ---
    function createModalHtml() {
        const modalHtmlContent = `
            <div style="
                background-color: #fefefe;
                margin: auto;
                padding: 30px;
                border: 1px solid #888;
                width: 350px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                text-align: center;
            ">
                <h3>Approval Login</h3>
                <p id="modalLoginMessage"></p>
                <div style="margin-bottom: 15px;">
                    <input type="text" id="modalUsername" placeholder="Username">
                    <input type="password" id="modalPassword" placeholder="Password">
                </div>
                <button id="modalLoginButton">Login</button>
                <button id="modalCloseButton">Cancel</button>
            </div>
        `;
        const modalContainer = document.createElement('div');
        modalContainer.id = 'approvalLoginModal';
        modalContainer.innerHTML = modalHtmlContent;
        document.body.appendChild(modalContainer);
        return modalContainer;
    }

    let approvalLoginModal, modalUsername, modalPassword, modalLoginButton, modalCloseButton, modalLoginMessage;

    // This function will be called to show the message on the parent page
    function showMainContentMessage(message) {
        if (window.parent && window.parent.showMainContentMessage) {
            window.parent.showMainContentMessage(message);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        injectModalStyles();
        approvalLoginModal = createModalHtml();

        modalUsername = document.getElementById('modalUsername');
        modalPassword = document.getElementById('modalPassword');
        modalLoginButton = document.getElementById('modalLoginButton');
        modalCloseButton = document.getElementById('modalCloseButton');
        modalLoginMessage = document.getElementById('modalLoginMessage');

        window.showApprovalLoginModal = function(attemptedUrl = '/') {
            approvalLoginModal.dataset.attemptedUrl = attemptedUrl;
            modalUsername.value = '';
            modalPassword.value = '';
            modalLoginMessage.textContent = '';
            approvalLoginModal.style.display = 'flex';
            setTimeout(() => approvalLoginModal.classList.add('show'), 10);
            modalUsername.focus();
        };

        window.hideApprovalLoginModal = function() {
            approvalLoginModal.classList.remove('show');
            setTimeout(() => approvalLoginModal.style.display = 'none', 300);
        };

        if (modalLoginButton) {
            modalLoginButton.addEventListener('click', async () => {
                const username = modalUsername.value;
                const password = modalPassword.value;
                modalLoginMessage.textContent = 'Logging in...';
                modalLoginMessage.style.color = '#007bff';

                try {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });

                    const result = await response.json();

                    if (result.success) {
                        modalLoginMessage.textContent = 'Login successful! Redirecting...';
                        setTimeout(() => {
                            window.hideApprovalLoginModal();
                            const attemptedUrl = approvalLoginModal.dataset.attemptedUrl || '/view_data.html';
                            if (window.parent && window.parent.loadContentInIframe) {
                                window.parent.loadContentInIframe(attemptedUrl);
                                const approvalMenuItem = window.parent.document.getElementById('approvalMenuItem');
                                if (approvalMenuItem && attemptedUrl.includes('/view_data.html')) {
                                    window.parent.document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
                                    approvalMenuItem.classList.add('active');
                                }
                            } else {
                                window.location.href = attemptedUrl;
                            }
                        }, 500);
                    } else {
                        modalLoginMessage.style.color = 'red';
                        modalLoginMessage.textContent = result.message || 'Login failed.';
                    }

                } catch (error) {
                    console.error('Login request failed:', error);
                    modalLoginMessage.style.color = 'red';
                    modalLoginMessage.textContent = 'Network error or server unreachable.';
                }
            });
        }

        if (modalCloseButton) {
            modalCloseButton.addEventListener('click', () => {
                window.hideApprovalLoginModal();
                showMainContentMessage('Please enter the correct password.');
            });
        }

        if (approvalLoginModal) {
            approvalLoginModal.addEventListener('click', (e) => {
                if (e.target === approvalLoginModal) {
                    window.hideApprovalLoginModal();
                    showMainContentMessage('Please enter the correct password.');
                }
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && approvalLoginModal.style.display === 'flex') {
                    window.hideApprovalLoginModal();
                    showMainContentMessage('Please enter the correct password.');
                }
            });
        }
    });
})();