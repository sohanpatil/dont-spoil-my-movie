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
        'spoilerItem':tempSpoilerList['spoilerItem']
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
        tempSpoilerList["spoilerItem"].splice($.inArray(item.currentTarget.innerHTML, tempSpoilerList["spoilerItem"]), 1);
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

    function updateListView(){
        if(tempSpoilerList['spoilerItem'] != null){
            console.log('temp splr is not nill');
            console.log(tempSpoilerList[0]);
            $('listView').empty();
            var html = "<ul>";
            for(var ctr =0; tempSpoilerList['spoilerItem'].length; ctr++){
                html = html + '<li><a class="spoilerListItem" href="#">' + tempSpoilerList['spoilerItem'][i] + '</a></i>';
            }
            html = html + '</ul>';
            $('#listView').append(html);
        }
    }

    function searchForSpoilers(){
        if(tempSpoilerList["spoilerItem"] != null){
            var searchString = "";
            tempSpoilerList["spoilerItem"].forEach(function(item){
                searchString = searchString + "p:contains('"+item+"'),";
            });
            searchString = searchString.substring(0, searchString.length - 2);
            $(searchString).parents('.userContentWrapper').css('-webkit-filter', 'blur(5px)');
        }
    }
});

