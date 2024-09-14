// ==UserScript==
// @name         Sort YouTube Subscriptions Left UI alphabatically
// @namespace    https://github.com/heyqule/youtube_subscription_sort
// @version      0.2
// @description  When you click "show more", you channel list from left menu sort alphabatically.
// @author       heyqule
// @match        https://www.youtube.com
// @match        https://www.youtube.com/*
// ==/UserScript==

(function() {
    'use strict';

    function sortChannels(a, b)
    {
        let nameA = a.querySelector("#endpoint").textContent.trim().toLowerCase();
        let nameB = b.querySelector("#endpoint").textContent.trim().toLowerCase();
        return nameA.localeCompare(nameB);
    }

    function sortSub(event) {
        let subscriptionList = document.querySelectorAll('div#sections ytd-guide-section-renderer:nth-child(2)')[0]
        if (!subscriptionList) return;

        let channels = Array.from(subscriptionList.querySelectorAll('div#items ytd-guide-entry-renderer'));
        let expandable_channels = Array.from(subscriptionList.querySelectorAll('ytd-guide-collapsible-entry-renderer div#expandable-items ytd-guide-entry-renderer'));

        channels.concat(expandable_channels)
        channels.sort(sortChannels);

        subscriptionList.innerHTML = '';

        channels.forEach(channel => {
            //Exclude show more and show less, they break after the sort.
            if (channel.id != 'collapser-item' && channel.id != 'expander-item') {
                subscriptionList.appendChild(channel)
            }
        });
    }

    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: (string, sink) => string
        });
    }


    const observer = new MutationObserver(() => {
        let show_more = document.querySelectorAll('div#sections ytd-guide-section-renderer:nth-child(2) ytd-guide-entry-renderer#expander-item')[0]

        if (show_more) {
            console.log('Add click event...')
            show_more.addEventListener("click", sortSub);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
