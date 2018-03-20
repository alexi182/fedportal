
$('#map').vectorMap({
      map: 'ru_reg_lcc_ru',
        
    markerStyle: {
        initial: {
        fill: '#F8E23B',
        stroke: '#383f47'
      }
    },
     backgroundColor: '#ffffff',
    markers: [
      {latLng: [246.90, 338.45], name: "Italy"},
      {latLng: [326.02, 350.55], name: 'Bahrain'},
    ],

      zoomButtons : true,
      zoomMax: 4,
      regionsSelectable: true,
      regionsSelectableOne: true,
      hoverColor: '#4d76a8',
      regionStyle: {
         initial: {
            fill: '#add7f7',
            "fill-opacity": 1,
            stroke: '#fff',
            "stroke-width": 0.2,
            "stroke-opacity": 0.5,
            "scale": ['#C8EEFF', '#0071A4']
         },
         hover: {
            fill: '#4d76a8',
            cursor: 'pointer'
         },
         selected: {
            fill: '#4d76a8'
         },
         selectedHover: {
             fill: '#4d76a8'
         }
      },
      onRegionClick: function (e, code) {
         // code это "Идентификатор Open Street Maps"
         //console.log(code);
      }
});