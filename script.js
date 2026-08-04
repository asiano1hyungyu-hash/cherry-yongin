import cherryHomeThaiImage from './src/assets/cherryhomethai.png';

/**
 * 체리홈타이 - 용인출장마사지 Interactive Script (script.js)
 * Vanilla JS - No external libraries required.
 */

document.addEventListener('DOMContentLoaded', () => {
  const heroBackgroundImage = document.getElementById('heroBackgroundImage');

  if (!heroBackgroundImage) {
    throw new Error('heroBackgroundImage 요소가 없습니다.');
  }

  heroBackgroundImage.src = cherryHomeThaiImage;

  heroBackgroundImage.addEventListener('load', () => {
    console.log('HERO IMAGE SUCCESS', {
      currentSrc: heroBackgroundImage.currentSrc,
      naturalWidth: heroBackgroundImage.naturalWidth,
      naturalHeight: heroBackgroundImage.naturalHeight
    });
  });

  heroBackgroundImage.addEventListener('error', () => {
    console.error(
      'HERO IMAGE FAILED',
      heroBackgroundImage.currentSrc
    );
  });

  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
      mobileMenuBtn.innerHTML = isExpanded ? '✕' : '☰';
    });

    // Close nav menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.innerHTML = '☰';
      });
    });
  }

  // 2. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other accordion items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current accordion item
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAnswer = firstItem.querySelector('.faq-answer');
    if (firstItem && firstAnswer) {
      firstItem.classList.add('active');
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }
  }

  // 3. Phone Copy & Toast Notification
  const toast = document.getElementById('toastNotice');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Expose toast copy to window for inline onclick handlers
  window.copyPhoneNumber = function(phoneNum) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(phoneNum).then(() => {
        showToast('전화번호(' + phoneNum + ')가 복사되었습니다. 바로 전화주세요!');
      }).catch(() => {
        fallbackCopyTextToClipboard(phoneNum);
      });
    } else {
      fallbackCopyTextToClipboard(phoneNum);
    }
  };

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('전화번호(' + text + ')가 복사되었습니다!');
    } catch (err) {
      showToast('전화예약: ' + text);
    }
    document.body.removeChild(textArea);
  }

  // 4. Highlight current table row on click for course selection guidance
  const tableRows = document.querySelectorAll('.course-table tbody tr');
  tableRows.forEach(row => {
    row.addEventListener('click', () => {
      tableRows.forEach(r => r.style.backgroundColor = '');
      row.style.backgroundColor = '#FFF0F3';
      const courseName = row.cells[0]?.textContent?.trim() || '';
      const coursePrice = row.cells[2]?.textContent?.trim() || '';
      showToast('선택 코스: ' + courseName + ' (' + coursePrice + ') - 전화/문자로 문의주세요!');
    });
  });

  // 5. Smooth Scrolling for Internal Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  console.log('체리홈타이 - 용인출장마사지 SEO Page Ready!');
});
