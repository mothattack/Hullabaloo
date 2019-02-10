/**
 * hullabaloo v 0.4
 *
 */
 (function (root, factory) {
     if (typeof exports === "object") {
         module.exports = factory();
     } else if (typeof define === "function" && define.amd) {
         define(['jquery'], factory);
     } else {
         root.hullabaloo = factory();
     }
 }(this, function () {
   return new function () {

    this.hullabaloo = function() {
      // Object being created now.
      // generated in this.generate ()
      this.hullabaloo = {};

      // Array with active alert objects
      this.hullabaloos = [];

      this.success = false;

      // Additional settings for the alert
      this.options = {
        ele: "body",
        offset: {
          from: "top",
          amount: 20
        },
        align: "right",
        width: 250,
        delay: 5000,
        allow_dismiss: true,
        stackup_spacing: 10,
        text: "An unknown error has occurred.",
        icon: {
          success: "fa fa-check-circle",
          info: "fa fa-info-circle",
          warning: "fa fa-life-ring",
          danger: "fa fa-exclamation-circle",
          light: "fa fa-sun",
          dark: "fa fa-moon"
        },
        status: "danger",
        alertClass: "", // Additional class for alert block
        fnStart: false, // F-Ia will be executed at startup
        fnEnd: false, // F-Ia will be executed on completion
        fnEndHide: false, // F-Ia will be executed after closing the message
      };
    };

    /*
     * Display the message
     * text - message text
     * status - message status
     * group - Message grouping
     */
    this.hullabaloo.prototype.send = function(text, status, group = 1) {
      // Run the function at startup
      if (typeof this.options.fnStart == "function")
        this.options.fnStart();

      // Link to the object
      var self = this;
      // Flag to indicate that a group of identical alerts was found
      var flag = 1;
      // Counter for the bulkhead of all alerts. Search for the same
      var i = +this.hullabaloos.length - 1;
      // Main alert if you already have the same alerts
      var parent;

      // Generate the message
      var hullabaloo = this.generate(text, status);

      // Check whether there are already the same messages
      if (group && this.hullabaloos.length) {
        // Let's go to the end of the alert array until we find a match
        while (i >= 0 && flag) {
          // If we have the same messages (group them)
          if (this.hullabaloos[i].text == hullabaloo.text && this.hullabaloos[i].status == hullabaloo.status) {
            // Remember the main alert
            parent = this.hullabaloos[i];
            // Flag exit loop
            flag = 0;

            // Move our alert to the place of the main with offset
            hullabaloo.elem.css(this.options.offset.from, parseInt(parent.elem.css(this.options.offset.from)) + 4);
            hullabaloo.elem.css(this.options.align, parseInt(parent.elem.css(this.options.align)) + 4);
          }
          i--;
        }
      }

      // Check if we have a group of alerts or only one
      if (typeof parent == 'object') {
        // If the alert in the group, add it to the group and reset the group counter
        clearTimeout(parent.timer);
        // Set a new counter for the group
        parent.timer = setTimeout(function() {
          self.closed(parent);
        }, this.options.delay);
        hullabaloo.parent = parent;
        // assign our alert to the group to the parent
        parent.hullabalooGroup.push(hullabaloo);
        // If the alert is one
      } else {
        // Remember the position of the alert, you need to move the alert up
        hullabaloo.position = parseInt(hullabaloo.elem.css(this.options.offset.from));

        // Activate the timer
        hullabaloo.timer = setTimeout(function() {
          self.closed(hullabaloo);
        }, this.options.delay);
        // Add an alert to the general alert array
        this.hullabaloos.push(hullabaloo);
      }

      // Show the alert to the user
      hullabaloo.elem.fadeIn();

      // Run the function on completion
      if (typeof this.options.fnEnd == "function")
        this.options.fnEnd();
    }


    // Close Alert
    this.hullabaloo.prototype.closed = function(hullabaloo) {
      var self = this;
      var idx, i, move, next;

      if("parent" in hullabaloo){
        hullabaloo = hullabaloo.parent;
      }

      // check if there is an array with alerts
      if (this.hullabaloos !== null) {
        // Find a closeable alert in the array
        idx = $.inArray(hullabaloo, this.hullabaloos);
        if(idx == -1) return;

        // If this is an alert group, then close all
        if (!!hullabaloo.hullabalooGroup && hullabaloo.hullabalooGroup.length) {
          for (i = 0; i < hullabaloo.hullabalooGroup.length; i++) {
            // close alert
            $(hullabaloo.hullabalooGroup[i].elem).remove();
          }
        }

        // Close our alert
        $(this.hullabaloos[idx].elem).fadeOut("slow", function(){
          this.remove();
        });

        if (idx !== -1) {
          next = idx + 1;
          // If there are other alerts in the array, raise them to the place of the closed one
          if (this.hullabaloos.length > 1 && next < this.hullabaloos.length) {
            // subtract the upper bound of the closed alert from the upper bound of the next alert
            // and calculate how much to move all alerts
            move = this.hullabaloos[next].position - this.hullabaloos[idx].position;

            // move all alerts that are closed
            for (i = idx; i < this.hullabaloos.length; i++) {
              this.animate(self.hullabaloos[i], parseInt(self.hullabaloos[i].position) - move);
              self.hullabaloos[i].position = parseInt(self.hullabaloos[i].position) - move
            }
          }

          // Remove the closed alert from the array with alerts
          this.hullabaloos.splice(idx, 1);

          // Run the function after closing the message
          if (typeof this.options.fnEndHide == "function")
            this.options.fnEndHide();
        }
      }
    }


    // Animation to raise alerts up
    this.hullabaloo.prototype.animate = function(hullabaloo, move) {
      var self = this;
      var timer,
        position, // Top alert, which drag
        i, // Counter for iterating the alert group
        group = 0; // Designation, alert group or single

      // Top / Bottom of the alert that is dragging
      position = parseInt(hullabaloo.elem.css(self.options.offset.from));
      // If this is an alert group
      group = hullabaloo.hullabalooGroup.length;

      // Start the timer
      timer = setInterval(frame, 2);
      // F-Ia for the timer
      function frame() {
        if (position == move) {
          clearInterval(timer);
        } else {
          position--;
          hullabaloo.elem.css(self.options.offset.from, position);

          // If this is an alert group
          if (group) {
            for (i = 0; i < group; i++) {
              hullabaloo.hullabalooGroup[i].elem.css(self.options.offset.from, position + 5);
            }
          }
        }
      }
    }


    // Generate alert on page
    this.hullabaloo.prototype.generate = function(text, status) {
      var alertsObj = {
        icon: "", // Icon
        status: status || this.options.status, // Status
        text: text || this.options.text, // text
        elem: $("<div>"), // HTML code of the alert itself

        // Grouping the same alerts
        hullabalooGroup: []
      };
      var option, // Alert settings
          offsetAmount, // Alert Indents
          css; // CSS properties of alert
          self = this;

      option = this.options;

      // Add an extra class
      alertsObj.elem.attr("class", "hullabaloo alert "+option.alertClass);

      // Status
      alertsObj.elem.addClass("alert-" + alertsObj.status);

      // Button to close the message
      if (option.allow_dismiss) {
        alertsObj.elem.addClass("alert-dismissible");
        alertsObj.elem.append("<button class=\"close\" type=\"button\" id=\"hullabalooClose\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>");
        $( "#hullabalooClose", $(alertsObj.elem) ).bind( "click", function(){
          self.closed(alertsObj);
        });
      }

      // Icon
      switch (alertsObj.status) {
        case "success":
          alertsObj.icon = option.icon.success;
          break;
        case "info":
          alertsObj.icon = option.icon.info;
          break;
        case "danger":
          alertsObj.icon = option.icon.danger;
          break;
        case "light":
          alertsObj.icon = option.icon.light;
          break;
        case "dark":
          alertsObj.icon = option.icon.dark;
          break;
        default:
          alertsObj.icon = option.icon.warning;
      }

      // Add text to the message
      alertsObj.elem.append("<i class=\"" + alertsObj.icon + "\"></i> " + alertsObj.text);

      // Assign Indent From Top
      offsetAmount = option.offset.amount;

      // If there are other alerts, add to their indent height
      $(".hullabaloo").each(function() {
        return offsetAmount = Math.max(offsetAmount, parseInt($(this).css(option.offset.from)) + $(this).outerHeight() + option.stackup_spacing);
      });

      // Add CSS styles
      css = {
        "position": (option.ele === "body" ? "fixed" : "absolute"),
        "margin": 0,
        "z-index": "9999",
        "display": "none"
      };
      css[option.offset.from] = offsetAmount + "px";
      alertsObj.elem.css(css);

      if (option.width !== "auto") {
        alertsObj.elem.css("width", option.width + "px");
      }
      $(option.ele).append(alertsObj.elem);
      switch (option.align) {
        case "center":
          alertsObj.elem.css({
            "left": "50%",
            "margin-left": "-" + (alertsObj.elem.outerWidth() / 2) + "px"
          });
          break;
        case "left":
          alertsObj.elem.css("left", "20px");
          break;
        default:
          alertsObj.elem.css("right", "20px");
      }

      return alertsObj;
    };


    return this.hullabaloo;
  }
}));
