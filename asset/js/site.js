// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

function clamp(min, value, max) {
    return Math.max(Math.min(value, max), min);
}

// Initialize OverlayScrollbars
document.addEventListener("DOMContentLoaded", () => {
    let bodyScroller = window.OverlayScrollbars(document.body, {
        callbacks: {
            onScroll: function (ev) {
                const scrollInfo = bodyScroller.scroll();
                const scrollTop = ev.target.scrollTop;
                const max = scrollInfo.max.y;
                floatingNavBar(max, scrollTop);
            }
        }
    });
});

// drop-in $.ajax replacement with identical lifecycle and cancellation behavior
// please don't use this for new code
function notAjax(options) {
    const {
        url,
        type: method,
        data,
        beforeSend,
        success,
        error,
        complete
    } = options;
    const params = data && Object.fromEntries([...Object.entries(data)].filter(([k, v]) => v != null));
    const queryString = params && "?" + new URLSearchParams(params) || "";
    const abortController = new AbortController();
    (async () => {
        beforeSend && beforeSend();
        try {
            const response = await fetch(url + queryString, {
                method,
                signal: abortController.signal
                // `credentials: "include"` is intentionally omitted - without, cookies will only be sent to same origin
            });
            if (!response.ok) {
                throw new Error((await response.text()) || "Kaputt!");
            }
            success && success(await response.text());
        } catch (ex) {
            error && error(ex);
        } finally {
            complete && complete();
        }
    })();
    return abortController;
}

// Dropdowns
if (document.querySelector('.dropdown-btn')) {
    const btns = document.querySelectorAll('.dropdown-btn');
    const menus = document.querySelectorAll('.dropdown-menu');
    btns.forEach(btn => {
        btn.addEventListener('mousedown', e => {
            e.preventDefault();
            e.stopPropagation();
            if (e.target.classList.contains('btn')) e.target.focus();
        });
        btn.addEventListener('click', e => {
            if (e.target.classList.contains('select-input')) e.target.focus();
            const openMenus = document.querySelectorAll('.dropdown-menu.open');
            const menu = e.target.parentElement.querySelector('.dropdown-menu');
            e.stopPropagation();
            if (!menu.classList.contains('open')) {
                openMenus.forEach(openMenu => {
                    openMenu.classList.remove('open');
                });
            }
            btn.childNodes.forEach(node => {
                node.addEventListener('click', e => e.stopPropagation());
            });
            if (menu.classList.contains('open')) {
                menu.classList.add('closing');
                setTimeout(() => {
                    menu.classList.remove('closing', 'open');
                }, 150);
            } else {
                menu.classList.add('open');
            }
        });
    });
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            e.stopPropagation();
            menus.forEach(menu => {
                if (menu.classList.contains('open')) {
                    menu.classList.add('closing');
                    setTimeout(() => {
                        menu.classList.remove('closing', 'open');
                    }, 150);
                }
            })
        }
    })
    menus.forEach(menu => {
        menu.addEventListener('click', e => e.stopPropagation());
        menu.childNodes.forEach(node => {
            node.addEventListener('click', e => e.stopPropagation());
        });
        menu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') item.click();
            });
        });
    });
    document.body.addEventListener("click", e => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu.classList.contains('open')) {
                menu.classList.add('closing');
                setTimeout(() => {
                    menu.classList.remove('closing', 'open');
                }, 150);
            }
        });
    });
}

// Modals
const modals = document.querySelectorAll('.modal-container');

function toggleModal(node) {
    if (node) {
        if (node.classList.contains('open')) {
            node.classList.add('closing');
            setTimeout(() => {
                node.classList.remove('closing', 'open');
            }, 150);
        } else {
            node.classList.add('open');
            node.focus();
        }
    }
}

function disableModalButton(e) {
    e.target.setAttribute('disabled', '');
    e.target.innerHTML = `<div class="spinner"></div>`;
}

window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.classList.contains('open')) {
                modal.classList.add('closing');
                setTimeout(() => {
                    modal.classList.remove('closing', 'open');
                }, 150);
            }
        });
    }
});

// Checkboxes
const checkboxes = document.querySelectorAll('.checkbox');
checkboxes.forEach(item => {
    item.addEventListener('keypress', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.target.click();
        }
    });
});

// Searchbars
const searchbars = document.querySelectorAll('.search-container');
if (searchbars) {
    searchbars.forEach(searchbar => {
        const searchInput = searchbar.querySelector('input');
        const clearBtn = searchbar.querySelector('.search-clear-btn');
        searchInput.addEventListener('input', e => {
            if (e.target.value) {
                clearBtn.classList.add('visible');
            } else {
                clearBtn.classList.remove('visible');
            }
        });
        clearBtn.addEventListener('click', e => {
            searchInput.value = '';
            clearBtn.classList.remove('visible');
        });
    });
}

// Quick downloader
window.addEventListener('keydown', e => {
    if (!localStorage.getItem('quickSelectMode')) localStorage.setItem('quickSelectMode', 'download');
    if ((e.ctrlKey && e.key === 'k') || e.ctrlKey && e.key === '/') {
        e.preventDefault();
        const modalContainerDOM = document.getElementById('quickselect-modal');
        if (modalContainerDOM) {
            toggleModal(modalContainerDOM);
            if (modalContainerDOM.classList.contains('open')) modalContainerDOM.querySelector('.text-input').focus();
            return;
        } else {
            const viewIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path></svg>`;
            const downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" fill-rule="evenodd" d="M7.47 10.78a.75.75 0 001.06 0l3.75-3.75a.75.75 0 00-1.06-1.06L8.75 8.44V1.75a.75.75 0 00-1.5 0v6.69L4.78 5.97a.75.75 0 00-1.06 1.06l3.75 3.75zM3.75 13a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z"></path></svg>`;
            const modalContainer = Object.assign(document.createElement('div'), {
                className: 'modal-container open',
                id: 'quickselect-modal',
                innerHTML : `
                <div class="modal-backdrop"></div>
                <div class="modal">
                    <div class="search-container">
                        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M11.5 7a4.499 4.499 0 11-8.998 0A4.499 4.499 0 0111.5 7zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"></path></svg>
                        <input class="text-input" placeholder="Search everything..."/>
                        <button type="button" class="quickselect-mode-toggle">${(localStorage.getItem('quickSelectMode') === 'download') ? downloadIcon : viewIcon}</button>
                    </div>
                    <ul class="modal-content"></ul>
                </div>`
            });
            tippy.delegate('body', {
                target: '.quickselect-mode-toggle',
                hideOnClick: false,
                offset: 0,
                placement: 'left',
                content: `Current Mode: ${localStorage.getItem('quickSelectMode')[0].toUpperCase() + localStorage.getItem('quickSelectMode').slice(1)}`,
                theme: 'default'
            });
            modalContainer.querySelector('.quickselect-mode-toggle').addEventListener('click', e => {
                const currentMode = localStorage.getItem('quickSelectMode');
                if (currentMode === 'download') {
                    localStorage.setItem('quickSelectMode', 'view');
                    e.target.innerHTML = viewIcon;
                    e.target._tippy.setContent(`Current Mode: ${localStorage.getItem('quickSelectMode')[0].toUpperCase() + localStorage.getItem('quickSelectMode').slice(1)}`);
                } else if (currentMode === 'view') {
                    localStorage.setItem('quickSelectMode', 'download');
                    e.target.innerHTML = downloadIcon;
                    e.target._tippy.setContent(`Current Mode: ${localStorage.getItem('quickSelectMode')[0].toUpperCase() + localStorage.getItem('quickSelectMode').slice(1)}`);
                }
            });
            let selectedIndex = 0;
            let setIndex = index => {
                const visibleItems = modalContainer.querySelectorAll('li:not(.hidden)');
                if (visibleItems.length) {
                    modalContainer.querySelectorAll('li.selected').forEach(item => {
                        item.classList.remove('selected');
                    });
                    selectedIndex = index;
                    visibleItems[selectedIndex].classList.add('selected');
                    visibleItems[selectedIndex].scrollIntoView({block: 'nearest'});
                }
            }
            async function getItems() {
                await fetch(`https://api.${window.location.host}/latest/store/addons`)
                .then(result => result.json())
                .then(result => {
                    result.forEach(addon => {
                        const item = Object.assign(document.createElement('li'), {
                            innerHTML: `${(addon.type === 'theme' ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M3.83885 5.85764C6.77986 1.94203 12.8685 0.802644 17.2028 3.49752C21.4826 6.15853 23.0566 11.2746 21.3037 16.0749C19.6485 20.6075 15.2873 22.4033 12.144 20.1233C10.9666 19.2692 10.5101 18.1985 10.2895 16.4595L10.1841 15.4715L10.1387 15.0741C10.016 14.14 9.82762 13.7216 9.43435 13.5024C8.89876 13.2038 8.54213 13.1969 7.83887 13.4694L7.48775 13.615L7.30902 13.693C6.29524 14.1332 5.62085 14.2879 4.76786 14.1092L4.56761 14.062L4.40407 14.0154C1.61511 13.1512 1.20202 9.36827 3.83885 5.85764ZM16.7669 10.5797C16.9456 11.2465 17.631 11.6423 18.2978 11.4636C18.9646 11.2849 19.3604 10.5995 19.1817 9.93267C19.003 9.26583 18.3176 8.87011 17.6508 9.04878C16.9839 9.22746 16.5882 9.91288 16.7669 10.5797ZM17.2615 14.0684C17.4402 14.7352 18.1256 15.1309 18.7924 14.9523C19.4592 14.7736 19.855 14.0882 19.6763 13.4213C19.4976 12.7545 18.8122 12.3588 18.1454 12.5374C17.4785 12.7161 17.0828 13.4015 17.2615 14.0684ZM14.7884 7.57703C14.9671 8.24386 15.6525 8.63959 16.3193 8.46091C16.9861 8.28224 17.3819 7.59681 17.2032 6.92998C17.0245 6.26315 16.3391 5.86742 15.6723 6.0461C15.0054 6.22478 14.6097 6.9102 14.7884 7.57703ZM14.7599 16.5754C14.9386 17.2422 15.624 17.638 16.2908 17.4593C16.9577 17.2806 17.3534 16.5952 17.1747 15.9284C16.996 15.2615 16.3106 14.8658 15.6438 15.0445C14.9769 15.2232 14.5812 15.9086 14.7599 16.5754ZM11.263 6.60544C11.4416 7.27227 12.1271 7.668 12.7939 7.48932C13.4607 7.31064 13.8565 6.62522 13.6778 5.95839C13.4991 5.29156 12.8137 4.89583 12.1469 5.07451C11.48 5.25318 11.0843 5.9386 11.263 6.60544Z" fill="currentColor"/>
                            </svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M13 2C14.364 2 15.4697 3.10572 15.4697 4.4697L15.469 5H19C19.5523 5 20 5.44772 20 6L19.999 9.499L18.4697 9.5C17.1603 9.5 16.0889 10.519 16.0053 11.8073L16 11.9697V12.0303C16 13.3397 17.019 14.4111 18.3073 14.4947L18.4697 14.5L19.999 14.499L20 18.0029C20 18.5552 19.5523 19.0029 19 19.0029L15.469 19.002L15.4697 19.5303C15.4697 20.8943 14.364 22 13 22C11.636 22 10.5303 20.8943 10.5303 19.5303L10.53 19.002L7 19.0029C6.44772 19.0029 6 18.5552 6 18.0029L5.999 14.471L5.4697 14.4712C4.10572 14.4712 3 13.3654 3 12.0015C3 10.6375 4.10572 9.53177 5.4697 9.53177L5.999 9.531L6 6C6 5.44772 6.44772 5 7 5H10.53L10.5303 4.4697C10.5303 3.10572 11.636 2 13 2Z" fill="currentColor"/>
                            </svg>`)}
                            <span>${addon.name}</span>`
                        });
                        item.setAttribute('data-author', addon.author);
                        item.setAttribute('data-tags', `[${addon.tags.toString().replace(/,/g, ', ')}]`);
                        item.addEventListener('click', e => {
                            if (localStorage.getItem('quickSelectMode') === 'download') {
                                window.location.href = `${window.location.origin}/download?id=${addon.id}`;
                            } else if (localStorage.getItem('quickSelectMode') === 'view') {
                                window.location.href = `${window.location.origin}/${addon.type}?id=${addon.id}`;
                            }
                            item.addEventListener('keypress', e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.target.click();
                                }
                            });
                        });
                        modalContainer.querySelector('.modal-content').appendChild(item);
                    });
                    setIndex(0);
                });
            }
            getItems();
            const searchInput = modalContainer.querySelector('.text-input');
            let handleKeyboard = e => {
                const visibleItems = modalContainer.querySelectorAll('li:not(.hidden)');
                if (e.key === 'ArrowDown' && !(selectedIndex >= visibleItems.length - 1)) {
                    setIndex(selectedIndex + 1);
                } else if (e.key === 'ArrowDown' && selectedIndex >= visibleItems.length - 1) {
                    setIndex(0);
                } else if (e.key === 'ArrowUp' && !(selectedIndex === 0)) {
                    setIndex(selectedIndex - 1);
                } else if (e.key === 'ArrowUp' && selectedIndex === 0) {
                    setIndex(visibleItems.length - 1);
                }
                if (e.key === 'Escape') {
                    toggleModal(document.getElementById('quickselect-modal'));
                }
            }
            document.body.appendChild(modalContainer);
            searchInput.focus();
            searchInput.addEventListener('input', e => {
                e.preventDefault();
                const symbols = ['@', '#'];
                modalContainer.querySelectorAll('li').forEach(item => {
                    if (!symbols.includes(e.target.value.charAt(0))) {
                        if (!item.innerText.toLowerCase().includes(e.target.value.toLowerCase())) {
                            item.classList.add('hidden');
                        } else if (item.classList.contains('hidden')) {
                            item.classList.remove('hidden');
                        }
                    } else if (e.target.value.startsWith('@')) {
                        if (!item.getAttribute('data-author').toLowerCase().includes(e.target.value.substring(1).toLowerCase())) {
                            item.classList.add('hidden');
                        } else if (item.classList.contains('hidden')) {
                            item.classList.remove('hidden');
                        }
                    } else if (e.target.value.startsWith('#')) {
                        /*let dataTags = item.getAttribute('data-tags').replaceAll(" ", "").split(',');
                        if (!dataTags.every(v => e.target.value.substring(1).toLowerCase().replaceAll(" ", "").split(',').includes(v))) {
                            item.classList.add('hidden');
                        } else if (item.classList.contains('hidden')) {
                            item.classList.remove('hidden');
                        }*/
                        if (!item.getAttribute('data-tags').includes(e.target.value.substring(1).toLowerCase())) {
                            item.classList.add('hidden');
                        } else if (item.classList.contains('hidden')) {
                            item.classList.remove('hidden');
                        }
                    }
                    if (symbols.includes(e.target.value)) {
                        item.classList.remove('hidden');
                    }
                });
                setIndex(0);
            });
            searchInput.addEventListener('keydown', e => {
                if (e.key === 'Enter' && modalContainer.querySelectorAll('li.selected:not(.hidden)').length) {
                    modalContainer.querySelectorAll('li.selected:not(.hidden)')[0].click();
                }
            });
            setIndex(0);
            modalContainer.querySelector('.modal-backdrop').addEventListener('click', e => {
                toggleModal(document.getElementById('quickselect-modal'));
            });
            modalContainer.addEventListener('keydown', handleKeyboard);
        }
    }
});

// DOM Rendering
const parseHTML = function (string) {
const template = document.createElement("div");
    template.innerHTML = string;
    template.style = "display: contents;";
    return template;
}

const renderChildren = function (element, children) {
    children = children.flat(10);
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child) continue;
        if (typeof child === "string" && child.charAt(0) === "<") element.appendChild(parseHTML(child));
        else element.append(child);
    }
};

const createElement = function (type, props = {}, ...children) {
    props = props || {};
    let element;

    if (typeof type === "function") {
        element = type(Object.assign(props, {children: props.children || children}));
        if (!(element instanceof Element) && element !== null) throw "Components must return an HTMLElement";
    } else if (typeof type === "string") {
        element = document.createElement(type);

        if (children.length) renderChildren(element, children);

        for (let prop in props) {
            if (prop === "children") {
                renderChildren(element, Array.isArray(props.children) ? props.children : [props.children]);
            } else if (prop.indexOf("on") === 0) {
                element[prop.toLowerCase()] = props[prop];
            } else if (prop === "className") {
                element.classList.add(...props[prop].split(" "));
            } else if (prop in element) {
                element[prop] = props[prop];
            } else {
                element.setAttribute(prop, props[prop]);
            }
        }
    }

    if (!element && element !== null) throw "Element could not be rendered!";

    return element;
};

const h = createElement;

async function copyInnerText(target) {
    var msg, toast;
    try {
        await navigator.clipboard.writeText((target.querySelector(".copy-me") || target).innerText);
        msg = "Copied to clipboard";
    } catch (err) {
        msg = err.message;
    }
    target.appendChild(toast = Object.assign(document.createElement("div"), {
        innerText: msg,
        className: "copy-toast",
    }));
    setTimeout(() => toast.remove(), 1000);
}
