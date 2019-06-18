var _url = "https://al-quran-8d642.firebaseio.com/data.json?print=pretty"

audiojs.events.ready(function() {
  audiojs.createAll();
});

$(document).ready(function(){

  var dataResults  = ""
  var surahResults = ""
  var surahs = []

  function renderPage(data){
    $.each(data, function(key, items){
      if($.inArray(items.nomor, surahs) == -1){
        surahs.push(items.nomor)
        surahResults += "<li onclick='updateAyat(this.value)' value='"+items.nomor+"'><a>" +items.nomor+ ". " +items.nama+ "</a></li>"
      }
    })
    $('#surah').html(surahResults)

    if(localStorage['nomorSaved'] == null){
      $.each(data, function(key, items){
        items.id = "Pilih Surat dari menu, klik icon toggle kiri atas."
        dataResults = "<li>"+items.id+" </li>"
      })

      $('#ayat').html(dataResults)
    }
    else {
      updateAyat(localStorage['nomorSaved'])
    }
  }

  var networkDataReceived = false

  //fresh data from online
  var networkUpdate = fetch(_url).then(function(response){
    return response.json()
  }).then(function(data){
    networkDataReceived = true
    renderPage(data)
  })

  //return data from cache
  caches.match(_url).then(function(response){
    if(!response) throw Error('no data on cache')
    return response.json()
  }).then(function(data){
    if(!networkDataReceived){
      renderPage(data)
      console.log('render data from cache')
    }
  }).catch(function(){
    return networkUpdate
  })

})

//on click and update data
function updateAyat(nomor){
  localStorage['nomorSaved'] = nomor
  var dataResults = ""
  var _newUrl = _newUrl

  _newUrl = "https://al-quran-8d642.firebaseio.com/surat/"+nomor+".json?print=pretty"

  $.get(_newUrl, function(data){
    $.each(data, function(key, items){

        dataResults += "<li><span style='background-color:black;color:white;padding: 5px;'>"+items.nomor+"</span>"
                        + "<span style='font-size:30px; display: block; text-align:right; margin-top: 10px;'>"+items.ar+"</span><br>"
                        + "<span>"+items.id+"</span></li>"
    })

    $('#ayat').html(dataResults)
  })

  //get name of surah (card__title)
  $.get(_url, function(data){

    var surahNameResult = "<span>"+nomor+". "+data[nomor-1].nama+" ("+data[nomor-1].ayat+" ayat)</span>"
    var surahAudio1 = data[nomor-1].audio
    var surahAudio = surahAudio1.replace('http', 'https') //to avoid mixed content on different security url
    var desc = "Quranque - "+ nomor +". "+data[nomor-1].nama+" ("+data[nomor-1].ayat+" ayat)"

    $('#surah_name').html(surahNameResult)
    // document.getElementById("surah_audio").src = surahAudio
    $('#surah_audio').attr('src', surahAudio)
    $(document).prop('title', desc)
  })

  hideMenu()
}



//serviceWorker things
if ('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('/serviceworker.js').then(function(registration){
      //registration wa successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err){
      //registration failed
      console.log('ServiceWorker registration failed', err);
    });
  })
}
