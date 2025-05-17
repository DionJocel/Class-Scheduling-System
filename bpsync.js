document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            const target = document.querySelector(tab.dataset.tabTarget);
            
            tabContents.forEach(tabContent => {
                tabContent.classList.remove('active');
            });
            
            target.classList.add('active');
            
            if (tab.classList.contains('button')) {
                event.preventDefault();
            }
        });
    });
});