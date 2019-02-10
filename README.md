# Hullabaloo.js

A simple alert plugin that uses the styles of standard Bootstrap alerts.
The plugin [bootstrap-growl] (https://github.com/ifightcrime/bootstrap-growl) was used to create it.

## Dependencies

1. Latest version of jQuery.
2. [Twitter Bootstrap] (http://twitter.github.com/bootstrap/index.html). (current rev tested with 4.0.0) (Optional)

## Use

Connect the bootstrap styles or the style files `hullabaloo.css` and` hullabaloo.js` to your page. Create the main hullabaloo object and call.

```javascript
// init
$ .hulla = new hullabaloo ();
// Set the position of the alert and indent from the top
$ .hulla.options.offset = {
    from: "top",
    amount: 30
};
// Set the distance between the alerts
$ .hulla.options.stackup_spacing = 15;

// Call the alert
$ .hulla.send ("Welcome!", "success");

// Forced cancellation of grouping
$ .hulla.send ("Welcome!", "success", 0);
```

## Additional functions

You can customize the call of your functions at different moments of the life of the alert

```javascript
// F-Ia will be executed as soon as the alert is displayed on the screen, but before it disappears
$ .hulla.options.fnEnd = function () {
    alert ("Alert got out and disappear soon")
}

// F-Ia will be executed even before an alert appears on the screen
$ .hulla.options.fnStart = function () {
    alert ("Alert will appear soon");
}

// F-Ia will be executed as soon as the alert disappears from the screen
$ .hulla.options.fnEndHide = function () {
    alert ("Alert closed");
}
```

## Options

Change default options

```javascript
$ .hulla.options. <option> = <value>;
```

List of available options:

| Option | Default | Description |
| -------------- | -------- | ------------------------------------- |
| offset.from | _top_ | Vertical alert position (top, bottom) |
| offset.amount | _20_ | Alert indent from screen border |
| align | _right_ | Horizontal alert position (left, right, center) |
| stackup_spacing | _10_ | Indent between alerts |
| width | _250_ | Width alert |
| delay | _4000_ | Display Delay |
| allow_dismiss | _true_ | Alert close button |
| text | | Default text |
| icon.success | | Default icon |
| icon.info | | Default icon |
| icon.warning | | Default icon |
| icon.danger | | Default icon |
| icon.light | | Default icon |
| icon.dark | | Default icon |
| status | _danger_ | Default Status |
| alertClass | _empty_ | Additional class for alert unit |
