/* ============================================
   TREATMENT PAGES — FAQ Accordion
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-item__answer');
      const isOpen = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item.active').forEach(open => {
        if (open !== item) {
          open.classList.remove('active');
          open.querySelector('.faq-item__answer').style.maxHeight = null;
        }
      });

      // Toggle current
      item.classList.toggle('active');
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
    });
  });
});
