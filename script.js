document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita o envio padrão do formulário

  const formData = new FormData(this); // Captura os dados do formulário

  // Enviar os dados para o servidor
  fetch('/enviar-email', {
      method: 'POST',
      body: formData,
  })
  .then(response => response.json())
  .then(data => {
      alert(data.message); // Exibe a mensagem de sucesso
  })
  .catch(error => {
      console.error('Erro:', error); // Exibe erros no console
  });
});
