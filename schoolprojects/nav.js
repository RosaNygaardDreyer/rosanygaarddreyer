document.addEventListener('DOMContentLoaded', function() {
    // If we're loading the navbar from an external file, use this code
    // Otherwise, just initialize the navbar functionality
    
    // Check if navbar is already in the document
    const existingHeader = document.querySelector('header');
    
    if (existingHeader) {
        // If header already exists, just initialize it
        initializeNavbar();
    } else {
        // Fetch navbar HTML and inject it
        fetch('navbar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load navbar');
                }
                return response.text();
            })
            .then(html => {
                // Insert navbar at the beginning of the body
                document.body.insertAdjacentHTML('afterbegin', html);
                
                // Initialize navbar functionality
                initializeNavbar();
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
            });
    }
});

// Function to handle navbar functionality
function initializeNavbar() {
    // Check if we're on mobile
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    
    if (isMobile) {
        // For mobile: handle dropdowns on click
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            
            // Remove any existing event listeners first (prevents duplicates)
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            newLink.addEventListener('click', function(e) {
                // Prevent navigation if this is a dropdown toggle
                if (dropdown.querySelector('.dropdown-content')) {
                    e.preventDefault();
                    
                    // Close all other dropdowns
                    document.querySelectorAll('.dropdown.active').forEach(item => {
                        if (item !== dropdown) {
                            item.classList.remove('active');
                        }
                    });
                    
                    // Toggle this dropdown
                    dropdown.classList.toggle('active');
                }
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }, { capture: true });
    }
    
    // On desktop, we use hover (CSS handles this)
    
    // Handle window resize to adjust mobile/desktop behavior
    window.addEventListener('resize', function() {
        const isMobileNow = window.matchMedia('(max-width: 767px)').matches;
        
        // If device type changed between mobile/desktop, reload
        if (isMobile !== isMobileNow) {
            location.reload();
        }
    });
}

(function () {
  // Are we inside /index/, /atelier/ or /schoolprojects/? If yes, we need ../ prefix
  var inSub = /\/(index|atelier|schoolprojects)\//.test(location.pathname);
  var p = inSub ? '../' : '';

  var map = {
    home:      'index/index.html',
    about:     'AboutMe.html',
    atelier:   'atelier/atelier.html',
    school:    'schoolprojects/schoolprojects.html',
    'school-2':'schoolprojects/School-Projects-Flow-2.html',
    'school-3':'schoolprojects/School-Projects-Flow-3.html',
    'school-4':'schoolprojects/School-Projects-Flow-4.html'
  };

  Object.keys(map).forEach(function (key) {
    document.querySelectorAll('[data-link="'+key+'"]').forEach(function (a) {
      a.href = p + map[key];
    });
  });
})();
