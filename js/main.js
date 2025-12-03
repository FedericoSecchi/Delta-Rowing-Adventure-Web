
$(document).ready(function(){
	"use strict";

	var window_width 	 = $(window).width(),
	window_height 		 = window.innerHeight,
	header_height 		 = $(".default-header").height(),
	header_height_static = $(".site-header.static").outerHeight(),
	fitscreen 			 = window_height - header_height;


	$(".fullscreen").css("height", window_height)
	$(".fitscreen").css("height", fitscreen);

  //-------- Active Sticky Js ----------//
  $(".default-header").sticky({topSpacing:0});


  // $('.navbar-nav>li>a').on('click', function(){
  //     $('.navbar-collapse').collapse('hide');
  // });


$('.active-blog-slider').owlCarousel({
        loop: true,
        dots: true,
        items: 1,
        autoplay: true,
        autoplayTimeout: 2000,
        smartSpeed: 1000,
        animateOut: 'fadeOut',
      })


    // Select all links with hashes
    $('.navbar-nav a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .on('click',function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top-50
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
    });


 });

 $(window).on('scroll', function () {
  if ($(this).scrollTop() > 100) {
    $('.default-header').addClass('header-scrolled');
  } else {
    $('.default-header').removeClass('header-scrolled');
  }
});
function handleMobileFeatureDropdown() {
  if (window.innerWidth <= 768) {
    const features = document.querySelectorAll('.feature-dropdown');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.2 }
    );

    features.forEach(feature => {
      observer.observe(feature);
    });
  }
}

document.addEventListener('DOMContentLoaded', handleMobileFeatureDropdown);

// Experiences Carousel - Vanilla JS
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.experiences-carousel');
  if (!carousel) return;

  const items = carousel.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');
  
  let currentIndex = 0;
  let autoplayInterval = null;

  // Create dots indicators
  function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ir a imagen ${index + 1}`);
      dot.setAttribute('aria-selected', index === 0);
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  // Update active state
  function updateActiveState() {
    items.forEach((item, index) => {
      item.classList.toggle('active', index === currentIndex);
    });
    
    // Update dots
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
      dot.setAttribute('aria-selected', index === currentIndex);
    });

    // Update buttons
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.setAttribute('aria-disabled', currentIndex === 0);
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex === items.length - 1;
      nextBtn.setAttribute('aria-disabled', currentIndex === items.length - 1);
    }
  }

  // Go to specific slide
  function goToSlide(index) {
    if (index < 0 || index >= items.length) return;
    currentIndex = index;
    updateActiveState();
    resetAutoplay();
  }

  // Next slide
  function nextSlide() {
    if (currentIndex < items.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to first
    }
    updateActiveState();
    resetAutoplay();
  }

  // Previous slide
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = items.length - 1; // Loop to last
    }
    updateActiveState();
    resetAutoplay();
  }

  // Autoplay functionality
  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  // Pause autoplay on hover
  const carouselWrapper = document.querySelector('.experiences-carousel-wrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', stopAutoplay);
    carouselWrapper.addEventListener('mouseleave', startAutoplay);
  }

  // Keyboard navigation
  carousel.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  carousel.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide(); // Swipe left - next
      } else {
        prevSlide(); // Swipe right - previous
      }
    }
  }

  // Initialize
  createDots();
  updateActiveState();
  startAutoplay();
});

