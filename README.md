# angular-spinner

Angular-spinner is an AngularJS directive that lets you prevent user interaction on parts of the page using an adjustable spinner. (based on [spin.js](https://github.com/fgnass/spin.js/) and [darthwade/angular-loading](https://github.com/darthwade/angular-loading))


**Demo:** Under construction

## Installation

Using `git`:
```shell
$ git clone https://github.com/plantener/angular-spinner.git
```

## Requirements & Dependencies
- AngularJS
- [Spin.js](https://github.com/fgnass/spin.js)

## Usage

Add `angular-spinner.js` and `angular-spinner.css` to your HTML. Also add dependency [spin.js](https://github.com/fgnass/spin.js) library.
``` html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.js"></script>
<script src="//rawgit.com/plantener/angular-spinner/master/angular-spinner.js"></script>

<link rel="stylesheet" type="text/css" href="//rawgit.com/plantener/angular-spinner/master/angular-spinner.css"/>
```

Add `plantener.spinner` as a module dependency for your app.
``` javascript
angular.module('myApp', ['plantener.spinner']);
```

Add `plantener-spinner` directive to that block which you want to lock during loading.
``` html
<div plantener-spinner="key" plantener-spinner-options="options"></div>
```

## Examples

### Basic Usage

### With options

``` html
<div plantener-spinner="usersSpinner" plantener-spinner-options="{text: 'Loading...'}">
  <p ng-repeat="user in users">{{user.name}}</p>
</div>
```
``` javascript
function SampleCtrl($scope, $spinner) {
  $scope.loadUsers = function() {
    // Lock UI and show spinner
    $spinner.start('usersSpinner');

    $http({method: 'GET', url: '/someUrl'})
        .success(function(data, status, headers, config) {
          $scope.users = data;

          // Unlock UI and hide spinner
          $spinner.stop('usersSpinner');
        });
  };

  $scope.loadUsers();
}
```

## Options

``` javascript
{
  active: false, // Defines current loading state
  text: 'Loading...', // Display text
  className: '', // Custom class, added to directive
  overlay: true, // Display overlay
  spinner: true, // Display spinner
  valign: 'middle', // Vertical alignment of the spinner
  spinnerOptions: {
    lines: 12, // The number of lines to draw
    length: 7, // The length of each line
    width: 4, // The line thickness
    radius: 10, // The radius of the inner circle
    rotate: 0, // Rotation offset
    corners: 1, // Roundness (0..1)
    color: '#000', // #rgb or #rrggbb
    direction: 1, // 1: clockwise, -1: counterclockwise
    speed: 2, // Rounds per second
    trail: 100, // Afterglow percentage
    opacity: 1 / 4, // Opacity of the lines
    fps: 20, // Frames per second when using setTimeout()
    zIndex: 2e9, // Use a high z-index by default
    className: 'plantener-spin', // CSS class to assign to the element
    top: 'auto', // Center vertically
    left: '50%', // Center horizontally
    position: 'relative' // Element position
  }
}
```

## API

`$spinner.setDefaultOptions(options)` - Overrides default options.

`$spinner.start(key)` - Activates spinner state by key.

`$spinner.stop(key)` - Deactivates spinner state by key.

## Events
`$loadingStart` - Fired once the loading is started. The '$rootScope' emits the event.
``` javascript
$scope.$on('$loadingStart', function(event, key){ ... });
```

`$loadingStopped` - Fired once the loading is stopped. The '$rootScope' emits the event.
``` javascript
$scope.$on('$loadingStopped', function(event, key){ ... });
```

## Styling
``` html
<div plantener-spinner="key" plantener-spinner-options="{className: 'custom-loading', spinnerOptions: {className: 'custom-spinner'}}" class="my-block">
  <p>Content</p>
</div>
```
Will generate:
``` html
<div plantener-spinner="key" plantener-spinner-options="{active: true, text: 'Please Wait...', className: 'custom-loading', spinnerOptions: {className: 'custom-spinner'}}" class="my-block">
  <p>Content</p>
  <div class="plantener-spinner plantener-spinner-overlay plantener-spinner-active custom-loading">
    <div class="plantener-spinner-body">
      <div class="plantener-spinner-spinner">
        <div class="custom-spinner"></div>
      </div>
      <div class="plantener-spinner-text">Please Wait...</div>
    </div>
  </div>
</div>
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
