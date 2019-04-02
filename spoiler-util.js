var tempSpoilerList;

//get spoiler items from 'chrome sync' (stores upto 100KB of data)
chrome.storage.sync.get("spoilerItem", function(results){
    tempSpoilerList = results;
    if (tempSpoilerList['spoilerItem']==null){
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
    });
}

function updateListView(){
    if(tempSpoilerList['spoilerItem'] != null){
        console.log(tempSpoilerList);
        $('#listView').empty();
        var html = "<ul>";
        for(var ctr =0; ctr< tempSpoilerList['spoilerItem'].length; ctr++){
            html = html + '<li><a class="spoilerListItem collection-item" href="#">' + tempSpoilerList['spoilerItem'][ctr] + '</a></i>';
        }
        html = html + '</ul>';
        $('#listView').append(html);
    }
}

function searchForSpoilers(){
    if(tempSpoilerList["spoilerItem"] != null){
        var searchString = "";
        tempSpoilerList["spoilerItem"].forEach(function(item){
            searchString = searchString + "p:contains('"+item+"'), ";
        });
        searchString = searchString.substring(0, searchString.length - 2);
        $(searchString).parents('.userContentWrapper').css('-webkit-filter', 'blur(5px)');
    }
}

//page load actions
$(function(){
    updateListView();
    searchForSpoilers();

    //setting a submit button onClickListener
    $('#addButton').click(function(event){
        tempItemToAdd = $('#addItem').val().toLowerCase();
        if(tempItemToAdd!=null && tempItemToAdd!=""){
            tempSpoilerList['spoilerItem'].push(tempItemToAdd);
            saveSpoilerList();
            $('#addItem').val('');
            updateListView();
            searchForSpoilers();
        }else{
            //toast error
            M.toast({html: "Input cannot be 'null'", classes: 'rounded'});
        }
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

    $('#loadFromMovieService').click(function(event){
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
});

