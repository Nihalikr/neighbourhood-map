var map;
var target;
function func() {
  var loc;
  var pointer;

  var bounds = new google.maps.LatLngBounds();
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:12.930072, lng:77.649831},
    zoom: 13
  });

  target = new google.maps.InfoWindow();

  for( var i=0;i<primeLoc.length;i++) {

    loc=primeLoc[i];
    var position = new google.maps.LatLng(loc.lat, loc.lng);
    bounds.extend(position);
    pointer = new google.maps.Marker({
        position: position,
        map: map,
        title: loc.title,
        animation: google.maps.Animation.DROP,
        venueId:loc.venueId
    });
    pointer.addListener = google.maps.event.addListener(pointer,'click', targetContent);
    pointer.addListener=google.maps.event.addListener(pointer,'click', toggleBounce);
    primeLoc[i].pointer =pointer;
}
}
var primeLoc=[
  {
    title:'Dr. Malathi Manipal Hospital',
    lat:12.917440,
    lng:77.591905,
    venueId:'4d1f24ff16cfb60c0b1b4f61'
  },

  {
    title:'Apollo hospital',
    lat: 12.917338,
    lng: 77.585177,
    venueId:'4bb6c4346edc76b0a281311c'
  },

  {
    title:'columbia Asia hospital',
    lat:12.959096,
    lng:77.745210,
    venueId:'4bd91e8811dcc928740af933'
  },

  {
    title:'NIMHANS hospital',
    lat:12.940912,
    lng:77.598254,
    venueId:'4f087542e4b0540ca21a5ff3'
  },

  {
    title:'Fortis hospital',
    lat:12.894813,
    lng:77.598914,
    venueId:'4bfba3b3ab180f47ff09b4ce'
  },

  {
    title:'St. Philomenas Hospital',
    lat:12.965614,
    lng:  77.610969,
    venueId:'4bd6c2196f649521354271ec'
  }
];

var vm={
  query:ko.observable(''),
   openInfowindow:function(loc){

        map.panTo(loc.pointer.getPosition());
        google.maps.event.trigger(loc.pointer,'click');

      }

};

vm.primeLoc=ko.dependentObservable(function(){
  var search=this.query().toLowerCase();
  return ko.utils.arrayFilter(primeLoc,function(loc){
    var matched=  loc.title.toLowerCase().indexOf(search)>=0;
    if(loc.pointer){
      loc.pointer.setVisible(matched);
    }
    return matched;
  });
},vm);

function targetContent(){

  var pointer=this;
  pointer.tips=[];
  var content;
  var venue = 'https://api.foursquare.com/v2/venues/'+pointer.venueId+'/tips?sort=recent&limit=3&client_id=MLI23RLZCWAAHOH4M1ERIUYBME52KTYGU43BBTMCGPW240H4&client_secret=EGGLQ5EVEY35A2HSANBONGKSSLOM1SJHTUBO5TNWPPZED4Y1&v=20170925';
  $.getJSON(venue,function(data){

    items=data.response.tips.items;
    for(i=0;i<items.length;i++)
    {

      pointer.tips.push(items[i].text);

    }
    target.setContent('<div class="info-window"><h4>'+pointer.title+'</h4><ul>foursquaretips<li>'+pointer.tips[0]+'</li><br><li>'+pointer.tips[1]+'</li><br><li>'+pointer.tips[2]+'</li></ul></div>');
    target.open(map,pointer);


    }).fail(function(jqXHR, textStatus, errorThrown) {
            target.setContent('<p><b>Error in retrieving comments!!</b></p>');
            target.open(map,pointer);
            console.log('getJSON request failed! ' + textStatus);
        });
}
var currentmarker=null;
function toggleBounce() {
var pointer=this;
        if (currentmarker) {
          currentmarker.setAnimation(null);
        }
        currentmarker=pointer;
          pointer.setAnimation(google.maps.Animation.BOUNCE);

      }

function Error() {
    alert("google Error");
    console.log("couldn't load the map!");
  }

ko.applyBindings(vm);