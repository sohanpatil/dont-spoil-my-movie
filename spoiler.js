var tempSpoilerList;

//get spoiler items from 'chrome sync' (stores upto 100KB of data)
chrome.storage.sync.get("spoilerItem", function(results){
    tempSpoilerList = results;
    if (tempSpoilerList["spoilerItem"]==null){
        tempSpoilerList = {
            'spoilerItem':[]
        };
        saveSpoilerList();
    }
});

function saveSpoilerList(){
    chrome.storage.sync.set({
        'spoilerItem':tempSpoilerList["spoilerItem"]
    }, function(result){
        if(chrome.runtime.error){
            console.log(chrome.runtime.error)
        }
    })
}

//page load actions
$(function(){
    updateListView();
    searchForSpoilers();

    //setting a submit button onClickListener
    $('#addButton').click(function(event){
        tempItemToAdd = $('#addItem').val().toLowerCase();
        tempSpoilerList['spoilerItem'].push(itemToAdd);
        saveSpoilerList();
        $('#addItem').val('');
        updateListView();
        searchForSpoilers();
    });

    //setting a clear button onClickListener
    $('#clearKeywords').click(function(event){
        tempSpoilerList = {
            'spoilerItem':[]
        };
        saveSpoilerList();
        $('#addItem').val('');
        updateListView();
        searchForSpoilers();
    });

    //setting a spoiler item onClickListener
    $(document).on('click', '.spoilerListItem', function (item) {
        $('p:contains(' + item.currentTarget.innerHTML + ')').parents('.userContentWrapper').css('-webkit-filter', '');
        spoilerList["spoilerItem"].splice($.inArray(item.currentTarget.innerHTML, spoilerList["spoilerItem"]), 1);
        saveSpoilerList();
        updateListView();
        searchForSpoilers();
    });

    //setting a MutationObserver to track spoilers even on DOM changes
    var observer = new MutationObserver(function(mutations, observer){
        searchForSpoilers();
    });

    observer.observe($('[id^=topnews_main_stream_]').get(0), {
        subtree: true, // watches target and it's descendants
        attributes: true // watches targets attributes
    });
});

