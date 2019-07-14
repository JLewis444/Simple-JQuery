var pokemonRepository = (function() {
    var repository = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
    function getAll() {
      return repository;
    }
  
    function add(pokemon) {
      repository.push(pokemon);
    }
  
    function addListItem(pokemon) {
      var $listItem = $('<li class="list-group-item"></li>');
      var $ul = $('.list-group');
      var $button = $(
        '<button type="button" class="btn btn-primary pokemon-button" data-toggle="modal" data-target="#modal-container">' +
          pokemon.name +
          '</button>'
      );
      $ul.append($listItem);
      $listItem.append($button);
  
      $button.on('click', function() {
        showDetails(pokemon);
      });
    }
  
    function showDetails(item) {
      $(document).on('click', '.pokemon-button', function() {
        var $nameElement = $('<h5>' + item.name + '</h5>');
        var $weightElement = $('<p>' + item.weight + '</p>');
        var $heightElement = $('<p>' + item.height + '</p>');
        var $imageElement = $(
          '<img src="' + item.imageUrl + '"alt=' + item.name + '>'
        );
  
        $('#pokemon-name').html($nameElement);
        $('#pokemon-details').html($weightElement);
        $('#pokemon-details').html($heightElement);
        $('#pokemon-image').html($imageElement);
        $('#modal').modal('show');
      });
    }
  
    function loadList() {
      return $.ajax(apiUrl)
        .then(function(response) {
          response.results.forEach(function(item) {
            var pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
        .catch(function(e) {
          console.error(e);
        });
    }
  
    function loadDetails(item) {
      var url = item.detailsUrl;
      return $.ajax(url)
        .then(function(response) {
          // add item details
          item.imageUrl = response.sprites.front_default;
          item.weight ='Weight: ' + response.weight;
          item.height = 'Height: ' + response.height;
          item.types = Object.keys(response.types);
        })
        .catch(function(e) {
          console.error(e);
        });
    }
  
    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails
    };
  })();
  
  pokemonRepository.loadList().then(function() {
    // data is loaded
    pokemonRepository.getAll().forEach(function(pokemon) {
      pokemonRepository.addListItem(pokemon);
      pokemonRepository.loadDetails(pokemon);
    });
  });