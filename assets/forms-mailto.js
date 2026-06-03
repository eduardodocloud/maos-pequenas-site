/* =====================================================
   Formulários no modo estático (sem backend WordPress)
   Captura o submit dos forms e abre o cliente de e-mail
   do usuário (mailto:) com os dados pré-preenchidos.
   ===================================================== */
(function () {
  const EMAIL_DESTINO = 'larmaospequenas@gmail.com';

  function serializeForm(form) {
    const fd = new FormData(form);
    const lines = [];
    for (const [key, value] of fd.entries()) {
      if (!value || key.startsWith('_')) continue;
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      lines.push(`${label}: ${value}`);
    }
    return lines.join('\n');
  }

  function handleForm(formId, subject) {
    const form = document.getElementById(formId);
    if (!form) return;
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const feedback = newForm.querySelector('.form-feedback');
      const body = serializeForm(newForm);
      const mailtoUrl = 'mailto:' + EMAIL_DESTINO +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      window.location.href = mailtoUrl;
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = '#D4EDDA';
        feedback.style.color = '#155724';
        feedback.textContent = 'Abrindo seu programa de e-mail… Se nada acontecer, envie diretamente para ' + EMAIL_DESTINO;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    handleForm('voluntarioForm', '[Voluntário] Nova inscrição');
    handleForm('parceiroForm',   '[Parceria] Nova proposta');
    handleForm('contactForm',    '[Contato] Mensagem do site');
  });
})();
