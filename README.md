# stateful
Data bindings objects, inspired from dojo framework Stateful component.

## How to use
* Add Stateful.js to your page.
* Create an object

    ```
    var myStateful = new Stateful();
    ```
    
* Create a Stateful from an existing object (keep properties and prototype)

    ```
    var myStateful = new Stateful(myObject);
    ```
    
* Set a property

    ```
    myStateful.set('foo','bar');
    ```
    
* Set multiple properties at once

    ```
    myStateful.set({foo: 'bar', bar: 'foo'});
    ```
    
* Get a property

    ```
    myStateful.get('foo');
    ```
    
* Watch a property

    ```
    myStateful.watch('foo',function(oldValue,newValue) {
        console.log('foo has changed from ' + oldValue + ' to ' + newValue);
    });
    ```
    
* Watch all properties

    ```
    myStateful.watch(function(name,oldValue,newValue){
        console.log(name + ' has changed from ' + oldValue + ' to ' + newValue);
    });
    ```
    
* Unwatch a property
    
    ```
    var handler = myStateful.watch('foo',function(oldValue,newValue) {
        console.log('foo has changed from ' + oldValue + ' to ' + newValue);
    });
    handler.remove();
    ```
    
* Call a function when a property is accessed or modified :
    
    ```
    myStateful.createSetHandler('foo',function(value) {
        return value.toUpperCase();
    });
    myStateful.createGetHandler('foo',function(value) {
       return value.toLowerCase();
    });
    myStateful.set('foo','bar'); // Handler is called, foo is set to BAR
    myStateful.get('foo'); // Handler is called, returns bar
    ```
    
* Bind two property of two different Statefuls
    
    ```
    var myStateful = new Stateful();
    var yourStateful = new Stateful();
    myStateful.bind('foo',yourStateful,'foo','both'); //Third arguments determines binding direction (From, to or both)
    myStateful.set('foo','bar');
    yourStateful.get('foo'); // returns bar
    yourStateful.set('bar','foo');
    myStateful.get('bar'); // returns foo
    ```
    
* Unbind a property
    
    ```
    myStateful.unbind('foo');
    ```
    
TODO:
* More tests
* Nested access ex: set('foo.bar');
