// Apply floating class to navbar on scroll
function floatingNavBar(max, scrollTop) {
    if (scrollTop > document.querySelector("#navbar-nav-items").clientHeight) {
        document.querySelector('#navbar').classList.add('floating');
    }
    else {
        document.querySelector('#navbar').classList.remove('floating');
    }
}

async function getApprovalCount() {
    try {
        const req = await fetch('/Moderator/GetApprovalCount');
        const res = await req.json();
        var el;
        if(el = document.querySelector('#user-submissions-item span')) el.innerText += ` (${res.submissions})`;
        if(el = document.querySelector('#user-updates-item span')) el.innerText += ` (${res.updates})`;
    } catch(err) {
        console.error(err);
    }
}

// Keyboard navigation for navbar dropdown
const navDropdownButton = document.getElementById('user-dropdown-btn');
if (navDropdownButton) {
    navDropdownButton.addEventListener('keypress', e => {
        if (e.key === 'Enter' || e.key === ' ') navDropdownButton.click();
    });
}