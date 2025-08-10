document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      return showNotification('すべての必須項目を入力してください。', 'error');
    }

    const inbox = JSON.parse(localStorage.getItem('contactInbox') || '[]');
    inbox.unshift({ id: 'msg_'+Math.random().toString(36).slice(2), name, email, subject, message, createdAt: new Date().toISOString() });
    localStorage.setItem('contactInbox', JSON.stringify(inbox));

    showNotification('お問い合わせを送信しました。ありがとうございます。', 'success');
    form.reset();
  });
}); 