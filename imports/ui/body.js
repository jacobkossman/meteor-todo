import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';

Template.body.onCreated( function bodyOnCreated() {
  'use strict';
  this.state = new ReactiveDict();
} );

Template.body.helpers( {
  tasks() {
    'use strict';
    const instance = Template.instance();
    if ( instance.state.get( 'hideCompleted' ) ) {
      // If hide completed is checked, filter tasks
      return Tasks.find( { checked: { $ne: true } }, { sort: { createdAt: -1 } } );
    }
    // Otherwise, return all of the tasks
    return Tasks.find( {}, { sort: { createdAt: -1 } } );
  },
  incompleteCount() {
    'use strict';
    return Tasks.find( { checked: { $ne: true } } ).count();
  }
} );

Template.body.events( {
  'submit .new-task' ( event ) {
    // Prevent default browser form submit
    'use strict';
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Tasks.insert( {
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),
      username: Meteor.user().username,
    } );

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input' ( event, instance ) {
    'use strict';
    instance.state.set( 'hideCompleted', event.target.checked );
  }
} );
