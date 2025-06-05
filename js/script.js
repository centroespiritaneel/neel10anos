// JavaScript para o site do 1º Seminário Espírita do NEEL

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const inscricaoForm = document.getElementById('inscricao-form');
    const btnDonation = document.getElementById('btn-donation');
    const donationModal = document.getElementById('donation-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Máscara para o campo de telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            // Formata o número de telefone
            if (value.length > 6) {
                value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
            } else if (value.length > 2) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara para o campo de CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            // Formata o CPF
            if (value.length > 9) {
                value = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9)}`;
            } else if (value.length > 6) {
                value = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6)}`;
            } else if (value.length > 3) {
                value = `${value.substring(0, 3)}.${value.substring(3)}`;
            }
            
            e.target.value = value;
        });
    }
    
    // Validação e envio do formulário
    if (inscricaoForm) {
        inscricaoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const cpf = document.getElementById('cpf').value.trim();
            
            if (!nome || !email || !telefone || !cpf) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validação de e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            // Preparar dados para envio
            const formData = {
                nome: nome,
                email: email,
                telefone: telefone.replace(/\D/g, ''),
                cpf: cpf.replace(/\D/g, '')
            };
            
            // Exibir mensagem de carregamento
            const submitBtn = inscricaoForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processando...';
            
            // Enviar dados para o webhook do n8n
            fetch('https://n8n.escolaamadeus.com/webhook-test/evento-neel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao processar inscrição');
                }
                return response.json();
            })
            .then(data => {
                console.log('Sucesso:', data);
                
                // Verificar se a inscrição foi processada com sucesso
                if (data.success && data.paymentUrl) {
                    // Redirecionar para o link de pagamento do Asaas
                    window.location.href = data.paymentUrl;
                } else {
                    // Se não conseguiu gerar o link, mostrar erro
                    throw new Error(data.message || 'Erro ao gerar link de pagamento');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao processar sua inscrição. Por favor, tente novamente.');
                
                // Restaurar botão
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
        });
    }
    
    // Abrir modal de doação
    if (btnDonation) {
        btnDonation.addEventListener('click', function() {
            donationModal.style.display = 'block';
            
            // Registrar evento de clique no botão de doação
            // Quando o endpoint estiver disponível, descomentar o código abaixo
            /*
            fetch('URL_DO_ENDPOINT_DE_RASTREAMENTO', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: 'donation_click',
                    timestamp: new Date().toISOString()
                })
            });
            */
            
            // Temporariamente, apenas registra no console
            console.log('Clique no botão de doação registrado:', new Date().toISOString());
        });
    }
    
    // Fechar modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            donationModal.style.display = 'none';
        });
    }
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(e) {
        if (e.target === donationModal) {
            donationModal.style.display = 'none';
        }
    });
    
    // Fechar modal ao pressionar ESC
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && donationModal.style.display === 'block') {
            donationModal.style.display = 'none';
        }
    });
});
